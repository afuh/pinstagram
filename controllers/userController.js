/* eslint-disable no-console */

const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const crypto = require('crypto');

// const parser = require('ua-parser-js');
// const requestIp = require('request-ip');
// const crypto = require('crypto');
// const axios = require('axios');

const Image = mongoose.model('Image');

exports.showEditAccount = (req, res) => {
  res.render('account', { title: "Account" });
}


exports.recentImages = async (req, res) => {
  const images = await Image.find().sort({ created: 'desc' }).limit(12);
  res.render('main', { title: "Home", images });
}

exports.showUser = async (req, res) => {
  const images = await Image.find().sort({ created: 'desc' }).limit(12);
  res.render('user', { title: "User", images });
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
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();
}

exports.saveImage = async (req, res) => {
  const image = await (new Image(req.body)).save();
  res.redirect(`/user/p/${image.url}`);
}

exports.showImage = async (req, res) => {
  const image = await Image.findOne({ url: req.params.image });
  res.render('image', { title: 'Image', image });
}
