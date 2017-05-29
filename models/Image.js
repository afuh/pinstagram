const mongoose = require('mongoose');
const striptags = require('striptags');
// const slug = require('slugs');

mongoose.Promise = global.Promise

const imageSchema = new mongoose.Schema({
  photo: {
    type: String,
    required: 'You must upload an Image'
  },
  caption: {
    type: String,
    trim: true
  },
  url: String,
  created: {
    type: Date,
    default: Date.now
  }
});

imageSchema.pre('save', function(next){
  this.caption = striptags(this.caption);
  next();
});

module.exports = mongoose.model('Image', imageSchema);
