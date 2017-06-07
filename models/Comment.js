const mongoose = require('mongoose');
const striptags = require('striptags');

mongoose.Promise = global.Promise;

const commentSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author!'
  },
  image: {
    type: mongoose.Schema.ObjectId,
    ref: 'Image',
    required: 'You must supply an image!'
  },
  text: {
    type: String,
    required: 'Your comment must have text!'
  }
});

commentSchema.pre('save', function(next) {
  this.text = striptags(this.text); 
  next();
});

function autopopulate(next) {
  this.populate('author');
  next();
}

commentSchema.pre('find', autopopulate);
commentSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Comment', commentSchema);
