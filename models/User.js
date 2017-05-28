const mongoose = require('mongoose');
const validator = require('validator');
const slug = require('slugs');

mongoose.Promise = global.Promise

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address']
  },
  name: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: "Please supply an username"
  },
  bio: {
    type: String,
    trim: true
  },
  slug: String,
  created: {
    type: Date,
    default: Date.now
  },
  // resetPasswordToken: String,
  // resetPasswordExpires: Date
});

userSchema.pre('save', function(next) {
  if (!this.isModified('username')) {
    next(); // skip it
    return; // stop this funciton
  }
  this.slug = slug(this.username);
  next();
});


module.exports = mongoose.model('User', userSchema);
