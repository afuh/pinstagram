const mongoose = require('mongoose');

const User = mongoose.model('User');
const Image = mongoose.model('Image');

exports.showUser = async (req, res, next) => {
  const profile = await User.findOne({ slug: req.params.user });
  if (!profile) return next();
  const images = await Image.find({ author: profile._id }).sort({ created: 'desc' }).limit(12);
  res.render('user', { title: "User", images, profile });
}


exports.showUserData = (req, res) => {
  res.render('profile', { title: "Edit Profile" });
}

exports.getUser = async (req, res, next) => {
  const user = await User.findOne({ slug: req.params.user })
  if (!user) return next();
  res.render('user', { user, title: user.name });
}

// https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/
exports.updateAccount = async (req, res) => {

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        website: req.body.website,
        bio: req.body.bio
      }
    },
    { new: true, runValidators: true, context: 'query' }
  );
  // req.flash('success', "Updated the profile!");
  res.redirect(`${req.user.slug}`)
}

exports.showLikedImages = async (req, res) => {
  const images = await Image.find({ _id: { $in: req.user.likes } })

  res.render('main', {images, title: "Likes"})
}
