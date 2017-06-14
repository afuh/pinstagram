const mongoose = require('mongoose');
const validator = require('validator');
const fs = require('fs');
const { suggestions } = require('../helpers');

const User = mongoose.model('User');
const Image = mongoose.model('Image');


exports.showProfile = async (req, res, next) => {
  const profile = await User.findOne({ slug: req.params.user }).populate('followers following');
  if (!profile) return next();
  const images = await Image.find({ author: profile._id }).sort({ created: 'desc' }).limit(12).populate('comments');
  res.render('user', { title: profile.username, images, profile });
}

exports.showUserData = (req, res) => {
  res.render('profile', { title: "Edit Profile" });
}

// https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/

exports.updateAccount = async (req, res) => {
  const isUrl = validator.isURL(req.body.website, {  protocols: ['http','https'], require_protocol: false });

  if (req.body.bio.length > 140) {
    req.flash('error', 'That Bio has too much words!')
    return res.redirect('back')
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        website: isUrl ? req.body.website : "",
        bio: req.body.bio
      }
    },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', "Updated the profile!");
  res.redirect(`${req.user.slug}`)
}

exports.showLikedImages = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user }).populate('likes')
  const images = await Image.find({ _id: { $in: user.likes } }).populate('comments')

  if (!images.length) {
    const profiles = await suggestions(req.user._id);
    res.render('tutorial', { title: 'find people', text: `You haven't liked any images yet`, profiles })
    return;
  }

  res.render('likes', {images, title: "Likes"})
}

exports.findProfile = async (req, res, next) => {
  const user = await User.findOne({ slug: req.params.user })
  req.body.profile = user;
  next();
}

exports.follow = async (req, res, next) => {
  const profile = req.body.profile;
  const followers = profile.followers.map(obj => obj.toString());
  const operator = followers.includes(req.user.id) ? '$pull' : '$addToSet';

  // Follow or unfollow this user
  const userP = User.findOneAndUpdate(
    { _id: profile._id },
    { [operator]: { followers: req.user._id} },
    { new: true }
  )

  // Add or remove of the following list that user
  const followingP = User.findOneAndUpdate(
    { _id: req.user._id },
    { [operator]: { following: profile._id} }
  )

  const [user, following] = await Promise.all([userP, followingP])
  res.json(user.followers)

  // next -> notification
  req.body.id = user.id
  req.body.image = { url: null, name: null }
  req.body.text = 0;
  req.body.notify = operator === "$pull" ? false : true
  next()
}

exports.showFollowers = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user }).populate('followers')
  res.json(user.followers)
}

exports.showFollowing = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user }).populate('following')
  res.json(user.following)
}

exports.saveAvatar = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.photo}
  )
  req.flash('success', 'You have updated your avatar!');
  res.redirect(`/${req.user.slug}`)
}

exports.removeAvatar = async (req, res) => {

  const user = await User.findOne( { _id: req.user._id } )
  const removeFromDisk = !user.avatar.includes('http') && fs.unlinkSync(`${__dirname}/../public/uploads/avatar/${user.avatar}`);
  const removeFromDb = user.update({ avatar: undefined });

  await Promise.all([removeFromDisk, removeFromDb])

  req.flash('success', 'You have removed your avatar!');
  res.redirect(`/${req.user.slug}`)
}
