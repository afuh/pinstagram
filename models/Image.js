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
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true } // show me the virtuals!
});

imageSchema.pre('save', function(next){
  this.caption = striptags(this.caption);
  next();
});

// http://mongoosejs.com/docs/populate.html
imageSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'image'
});

function autopopulate(next) {
  this.populate('author comments');
  next();
}

imageSchema.pre('find', autopopulate);
imageSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Image', imageSchema);
