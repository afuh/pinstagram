// const fs = require('fs');

exports.siteName = `Instagramo`;

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.moment = require('moment');

exports.menu = [
  { url: '#', title: 'Likes'},
  { url: '/logout', title: 'Log out'}
];

// exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

exports.gravatar = "Your Gravatar is an image that follows you from site to site appearing beside your name when you do things like comment or post on a blog. Avatars help identify your posts on blogs and web forums, so why not on any site?"

exports.img = [
  "http://source.unsplash.com/random/290x290?sig=0",
  "http://source.unsplash.com/random/290x290?sig=1",
  "http://source.unsplash.com/random/290x290?sig=2",
  "http://source.unsplash.com/random/290x290?sig=3",
  "http://source.unsplash.com/random/290x290?sig=4",
  "http://source.unsplash.com/random/290x290?sig=5",
  "http://source.unsplash.com/random/290x290?sig=6",
  "http://source.unsplash.com/random/290x290?sig=7",
  "http://source.unsplash.com/random/290x290?sig=8",
  "http://source.unsplash.com/random/290x290?sig=9",
  "http://source.unsplash.com/random/290x290?sig=10",
  "http://source.unsplash.com/random/290x290?sig=11"
]
