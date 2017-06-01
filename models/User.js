const mongoose = require('mongoose');
const validator = require('validator');
const slug = require('slugs');
const md5 = require('md5');
const passportLocalMongoose = require('passport-local-mongoose');

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
    lowercase: true,
    validate: [validator.isAlphanumeric, 'Invalid username'],
    required: "Please supply an username"
  },
  bio: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true,
    validate: [validator.isURL, 'Invalid Url']
  },
  likes: [
    { type: mongoose.Schema.ObjectId, ref: 'Image'}
  ],
  posts: {
    type: Number,
    default: 0
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

userSchema.virtual('gravatar').get(function(){
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?d=identicon`;
});


// https://github.com/saintedlama/passport-local-mongoose#options
userSchema.plugin(passportLocalMongoose, { usernameField: 'username' })

module.exports = mongoose.model('User', userSchema);
