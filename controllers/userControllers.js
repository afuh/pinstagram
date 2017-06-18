const mongoose = require('mongoose');
const validator = require('validator');
const fs = require('fs');
const promisify = require("es6-promisify");

const { suggestions } = require('../helpers');

const User = mongoose.model('User');
const Image = mongoose.model('Image');

// ======== User profile ======== //
exports.showProfile = async (req, res, next) => {
  const profile = await User.findOne({ slug: req.params.user }).populate('followers following');
  if (!profile) return next();

  const images = await Image.find({ author: profile._id }).sort({ created: 'desc' }).limit(32).populate('comments');

  res.render('user', { title: profile.username, images, profile });
}

exports.showUserData = (req, res) => {
  res.render('profile', { title: "Edit Profile" });
}

exports.updateAccount = async (req, res) => {
  if (!validator.isLength(req.body.bio, {min: undefined, max: 140})) {
    req.flash('error', 'That Bio has too much words! Try with the short version')
    return res.redirect('back')
  }

  if (!validator.isLength(req.body.name, {min: undefined, max: 60})) {
    req.flash('error', 'Wow, that is a really long name! Try with your Nickname instead')
    return res.redirect('back')
  }

  if (!validator.isLength(req.body.website, {min: undefined, max: 60})) {
    req.flash('error', 'I think you should try with a shorter Url')
    return res.redirect('back')
  }

  if (!validator.isEmail(req.body.email)) {
    req.flash('error', 'Invalid email, please try again')
    return res.redirect('back')
  }

  const isUrl = validator.isURL(req.body.website, {  protocols: ['http','https'], require_protocol: false });

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: {
        name: req.body.name,
        // username: req.body.username,
        email: req.body.email,
        website: isUrl ? req.body.website : "",
        bio: req.body.bio
      }
    },
    { new: true, runValidators: false, context: 'query' }
  );
  req.flash('success', "Updated the profile!");
  res.redirect(`${req.user.slug}`)
}

// ======== User likes page ======== //
exports.showLikedImages = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).populate('likes')
  const images = await Image.find({ _id: { $in: user.likes } }).populate('comments')

  if (!images.length) {
    const profiles = await suggestions(req.user._id);
    res.render('tutorial', { title: 'find people', text: `You haven't liked any images yet`, profiles })
    return;
  }

  res.render('likes', {images, title: "Likes"})
}

// ======== Follow ======== //
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
  res.json(user.followers.length)

  // next -> notification
  req.body.id = user.id
  req.body.image = { url: null, name: null }
  req.body.text = 0;
  req.body.notify = operator === "$pull" ? false : true
  next()
}

exports.showFollowers = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user }).populate('followers')

  const followers = [...user.followers.map(profile => {
    return {
      name: profile.name,
      username: profile.username,
      slug: profile.slug,
      gravatar: profile.gravatar,
      avatar: profile.avatar
    }
  })]

  if (req.path.includes('api')) {
    res.json(followers);
    return;
  }

  res.render('list', { title: "Followers", list: followers })
}

exports.showFollowing = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user }).populate('following')

  const following = [...user.following.map(profile => {
    return {
      name: profile.name,
      username: profile.username,
      slug: profile.slug,
      gravatar: profile.gravatar,
      avatar: profile.avatar
    }
  })]

  if (req.path.includes('api')) {
    res.json(following);
    return;
  }

  res.render('list', { title: "Following", list: following })
}

// ======== Avatar ======== //
exports.saveAvatar = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.photo}
  )
  req.flash('success', 'You have updated your avatar!');
  res.redirect(`/${req.user.slug}`)
}

exports.removeAvatar = async (req, res) => {
  const remove = promisify(fs.unlink)

  const user = await User.findOne( { _id: req.user._id } )
  const removeFromDisk = !user.avatar.includes('http') && remove(`${__dirname}/../public/uploads/avatar/${user.avatar}`);
  const removeFromDb = user.update({ avatar: undefined });

  await Promise.all([removeFromDisk, removeFromDb])

  req.flash('success', 'You have removed your avatar!');
  res.redirect(`/${req.user.slug}`)
}
