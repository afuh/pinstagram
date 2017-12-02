exports.siteName = `Pinstagram`;

exports.show = obj => JSON.stringify(obj, null, 2);

exports.moment = require('moment');

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
