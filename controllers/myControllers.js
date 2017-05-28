/* eslint-disable no-console */

// const mongoose = require('mongoose');
// const moment = require('moment');
// const parser = require('ua-parser-js');
// const requestIp = require('request-ip');
// const validator = require('validator');
// const crypto = require('crypto');
// const axios = require('axios');
// const multer = require('multer');


exports.showLogin = (req, res) => {
  res.render('login', { title: "Login" });
}

exports.showMain = (req, res) => {
  res.render('main', { title: "Home" });
}

exports.showUser = (req, res) => {
  res.render('user', { title: "User" });
}

exports.showEditAccount = (req, res) => {
  res.render('account', { title: "Account" });
}
