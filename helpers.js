const fs = require('fs');

exports.siteName = `New Project`;

exports.dump = obj => JSON.stringify(obj, null, 2);

exports.moment = require('moment');

exports.menu = [
  { url: '#', title: 'Nav 1'},
  { url: '#', title: 'Nav 2'}
];

// exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`);

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
