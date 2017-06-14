exports.siteName = `Pinstagram`;

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.moment = require('moment');


const mongoose = require('mongoose');
const User = mongoose.model('User');

// Look for profiles to suggest the user
exports.suggestions = async (user) => {
  const users = await User.find({
    posts: { $gt: 1 },
    _id: { $ne: user }
  })
  .sort({ created: 'desc' })
  .limit(6)

  return users.map(user => {
    return {
      name: user.name,
      username: user.username,
      slug: user.slug,
      gravatar: user.gravatar,
      avatar: user.avatar
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
