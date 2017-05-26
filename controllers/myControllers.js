/* eslint-disable no-console */

// const mongoose = require('mongoose');
// const moment = require('moment');
// const parser = require('ua-parser-js');
// const requestIp = require('request-ip');
// const validator = require('validator');
// const crypto = require('crypto');
// const axios = require('axios');
// const multer = require('multer');

exports.showMain = (req, res) => {
  res.render('main', { title: "Main section" });
}
