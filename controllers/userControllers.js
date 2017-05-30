const mongoose = require('mongoose');

const User = mongoose.model('User');


exports.showUserData = (req, res) => {
  res.render('profile', { title: "Edit Profile" });
}

// https://docs.mongodb.com/manual/reference/method/db.collection.findOneAndUpdate/
exports.updateAccount = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        bio: req.body.bio
      }
    },
    { new: true, runValidators: true, context: 'query' }
  );
  // req.flash('success', "Updated the profile!");
  res.redirect('back')
}
