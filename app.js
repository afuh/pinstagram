const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash')
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const app = express();
const routes = require('./routes');
const helpers = require('./helpers');

// passport
require('./handlers/passport');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.h = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

app.use('/', routes);

module.exports = app;
