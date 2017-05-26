const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const routes = require('./routes');
const helpers = require('./helpers');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.h = helpers;
  next();
});

app.use('/', routes);

module.exports = app;
