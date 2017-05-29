/* eslint-disable no-console */

const mongoose = require('mongoose');
const multer = require('multer');
const jimp = require('jimp');
const crypto = require('crypto');
// const parser = require('ua-parser-js');
// const requestIp = require('request-ip');
// const validator = require('validator');
// const crypto = require('crypto');
// const axios = require('axios');


// const User = mongoose.model('User');
const Image = mongoose.model('Image');

exports.showLogin = (req, res) => {
  res.render('login', { title: "Login" });
}

exports.showMain = (req, res) => {
  res.render('main', { title: "Home" });
}

exports.showEditAccount = (req, res) => {
  res.render('account', { title: "Account" });
}

exports.showUser = (req, res) => {
  res.render('user', { title: "User" });
}

// exports.updateAccount = async (req, res) => {
//   // const user = await (new User(req.body)).save();
//   // res.redirect('back')
//
//   res.json(req.body)
// }


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
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);

  next();
}

exports.saveImage = async (req, res) => {
  const image = await (new Image(req.body)).save();
  res.redirect(`/user/${image.url}`);
}

exports.showImage = async (req, res) => {
  const image = await Image.findOne({ url: req.params.image });
  image.created = "rolo"
  res.render('image', { title: 'Image', image });
}
