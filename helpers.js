exports.siteName = `Pinstagram`;

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.moment = require('moment');

const User = require('./models/User');
const users = async () => await User.find({ posts: { $gt: 1 }}).limit(4)

users()
  .then(data => exports.suggestions = data)
  .catch(e => console.log(e))


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
