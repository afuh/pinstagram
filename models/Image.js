const mongoose = require('mongoose');
const striptags = require('striptags');

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
  likes: [
    { type: mongoose.Schema.ObjectId, ref: 'User' }
  ],
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  toJSON: { virtuals: true }
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

module.exports = mongoose.model('Image', imageSchema);
