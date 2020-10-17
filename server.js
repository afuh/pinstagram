/* eslint-disable no-console */
require('dotenv').config({path: '.env'});
/* Credits */
// Icons made by Madebyoliver http://www.flaticon.com/authors/madebyoliver
// Loader by SamHerbert http://samherbert.net/svg-loaders/
// Email template by Wes Bos http://wesbos.com

const express = require('express');
const session = require('express-session');
const expressValidator = require('express-validator');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash')
const morgan = require('morgan')
const promisify = require("es6-promisify");

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const mongodbErrorHandler = require('mongoose-mongodb-errors')

const passport = require('passport');
require('./handlers/passport');

const api = require('./routes/api');
const auth = require('./routes/auth');
const routes = require('./routes/routes');

const helpers = require('./helpers');
const errors = require('./handlers/errors')

const db = process.env.NODE_ENV === 'test' ? process.env.DATABASE_LOCAL : process.env.DATABASE

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.Promise = global.Promise

mongoose.connection.on('error', err => {
  console.error(`→ ${err.message}`);
});

mongoose.plugin(mongodbErrorHandler);

const app = express();

if (app.get('env') !== 'production') {
  app.use(morgan('dev', {
    skip(req) {
      return req.path.match(/(png|svg|jpeg|woff2|css|js|)$/ig)[0] ? true : false
    }
  }))
}

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

app.use((req, res, next) => {
  req.login = promisify(req.login, req);
  next();
});

app.use('/', auth, routes);
app.use('/api', api);

app.use(errors.notFound);
if (app.get('env') === 'development') {
  app.use(errors.developmentErrors);
}
app.use(errors.productionErrors)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('\x1b[34m%s\x1b[0m', `
  ${app.get('env').toUpperCase()}

  Port      → http://localhost:${PORT}
  Database  → ${mongoose.connection.host}/${mongoose.connection.name}
  `
));
