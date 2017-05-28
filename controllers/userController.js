/* eslint-disable no-console */

const mongoose = require('mongoose');
// const moment = require('moment');
// const parser = require('ua-parser-js');
// const requestIp = require('request-ip');
// const validator = require('validator');
// const crypto = require('crypto');
// const axios = require('axios');
// const multer = require('multer');

const User = mongoose.model('User');

exports.showLogin = (req, res) => {
  res.render('login', { title: "Login" });
}

exports.showMain = (req, res) => {
  res.render('main', { title: "Home" });
}

exports.showUser = (req, res) => {
  res.render('user', { title: "User" });
}

exports.showUploadImage = (req, res) => {
  res.render('image', { title: "Upload" });
}

exports.showEditAccount = (req, res) => {
  res.render('account', { title: "Account" });
}

// exports.updateAccount = async (req, res) => {
//   // const user = await (new User(req.body)).save();
//   // res.redirect('back')
//
//   res.json(req.body)
// }
