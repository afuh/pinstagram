const mongoose = require('mongoose');
const validator = require('validator');
const fs = require('fs');
const moment = require('moment');

const User = mongoose.model('User');
const Image = mongoose.model('Image');
const Notification = mongoose.model('Notification');

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
  const isUrl = validator.isURL(req.body.website, {  protocols: ['http','https'], require_protocol: true });

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
  res.render('likes', {images, title: "Likes"})
}

exports.findProfile = async (req, res, next) => {
  const user = await User.findOne({ slug: req.params.user })
  req.body.profile = user;
  next();
}

exports.follow = async (req, res) => {
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
}

exports.showFollowers = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user }).populate('followers')
  res.json(user.followers)
}

exports.showFollowing = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user }).populate('following')
  res.json(user.following)
}

exports.avatar = (req, res) => {
  res.render('avatar', {title: "avatar"});
}

exports.saveAvatar = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: req.body.photo}
  )
  req.flash('success', 'You have updated your avatar!');
  res.redirect('/edit')
}

exports.removeAvatar = async (req, res) => {

  const user = await User.findOne( { _id: req.user._id } )
  const removeFromDisk = fs.unlinkSync(`${__dirname}/../public/uploads/avatar/${user.avatar}`);
  const removeFromDb = user.update({ avatar: undefined });

  await Promise.all([removeFromDisk, removeFromDb])

  req.flash('success', 'You have removed your avatar!');
  res.redirect('/edit')
}





// ==================================================================
// Versión creando un model y haciendo virtual el campo en user.
// ==================================================================
// exports.notify = async (req, res, next) => {
//   const profile = req.body.profile
//   const notify = await new Notification({
//     author: req.user._id,
//     user: profile._id,
//     text: `${req.user.username} te empezó a seguir`
//   }).save()
//   next()
// }
//
//
// exports.showNotifications = async (req, res) => {
//   const user = await User.findOne({ slug: req.params.user }).populate('notifications')
//
//   const notification = await Notification.find({ _id: { $in: user.notifications }}).populate('author')
//
//   const n = []
//
//   notification.map(a => {
//     const data = {
//       username: a.author.username,
//       slug: a.author.slug,
//       avatar: a.author.avatar || a.author.gravatar,
//       notify: a.text,
//       date: moment(a.created).fromNow()
//     }
//     n.push(data)
//   })
//
//   res.json(n)
// }

// ==================================================================
// Versión haciendo a mano el campo directamente en el usuario
// ==================================================================
exports.notify = async (req, res, next) => {
  const notify = req.body.notify

  const user = await User.findOneAndUpdate(
    { slug: req.params.user },
    { $addToSet: { notifications: {
        author: {
          username: req.user.username,
          slug: req.user.slug,
          avatar: req.user.avatar || req.user.gravatar
        },
        notify
    }}}
  )
  next()
}

exports.showNotifications = async (req, res) => {
  const user = await User.findOne({ slug: req.params.user })
  res.json(user.notifications)
}
