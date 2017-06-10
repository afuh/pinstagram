const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author!'
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an user!'
  },
  text: {
    type: String,
    required: 'Your notification must have text!'
  }
});


module.exports = mongoose.model('Notification', notificationSchema);
