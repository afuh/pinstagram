exports.siteName = `Pinstagram`;

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.moment = require('moment');

exports.gravatar = "Your Gravatar is an image that follows you from site to site appearing beside your name when you do things like comment or post on a blog. Avatars help identify your posts on blogs and web forums, so why not on any site?"

const User = require('./models/User');
const users = async () => await User.find({ posts: { $gt: 1 }}).limit(4)

users()
  .then(data => exports.suggestions = data)
  .catch(e => console.log(e))
