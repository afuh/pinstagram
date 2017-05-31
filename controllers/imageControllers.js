/* eslint-disable no-console */

// const parser = require('ua-parser-js');
// const requestIp = require('request-ip');
// const axios = require('axios');

const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const crypto = require('crypto');

const Image = mongoose.model('Image');
const User = mongoose.model('User');

// Home page
exports.recentImages = async (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  const images = await Image.find().sort({ created: 'desc' }).limit(12);
  res.render('main', { title: "Home", images });
}

exports.imageForm = (req, res) => {
  res.render('uploadImage', { title: "Upload" });
}

exports.upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next ({ message: `That filetype isn't allowed!`}, false);
    }
  }
}).single('photo');

exports.resize = async (req, res, next) => {
  // rename
  const extension = req.file.mimetype.split('/')[1];
  req.body.url = crypto.randomBytes(10).toString('hex');
  req.body.photo = `${req.body.url}.${extension}`;

  // resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(1080, jimp.AUTO);
  await photo.write(`./public/uploads/images/${req.body.photo}`);

  next();
}

exports.saveImage = async (req, res) => {
  req.body.author = req.user._id;
  const image = await (new Image(req.body)).save();
  // req.flash('success', 'bla bla');

  const imageCounter = req.user.posts+= 1;

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: { posts: imageCounter } }
  );
  res.redirect(`/user/p/${image.url}`);
}

exports.showImage = async (req, res) => {
  const image = await Image.findOne({ url: req.params.image });
  res.render('image', { title: 'Image', image });
}
