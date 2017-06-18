exports.siteName = `Pinstagram`;

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.moment = require('moment');


const mongoose = require('mongoose');
const User = mongoose.model('User');

// Look for profiles to suggest the user
exports.suggestions = async (_id) => {
  const user = await User.findOne({ _id })

  const profiles = await User.find({
    posts: { $gt: 2 },
    _id: { $ne: _id, $nin: user.following },
  })
  .sort({ created: 'desc' })
  .limit(12)

  return profiles.map(profile => {
    return {
      name: profile.name,
      username: profile.username,
      slug: profile.slug,
      gravatar: profile.gravatar,
      avatar: profile.avatar
    }
  })
}

// Check if the avatar is an original image, a facebook cover or a gravatar
exports.avatar = (pre, px = 30) => {
  if (!pre.avatar) {
    return `${pre.gravatar}&s=${px}`
  }

  if (pre.avatar.includes("http")) {
    return pre.avatar;
  } else {
    return `/uploads/avatar/${pre.avatar}`;
  }
}
