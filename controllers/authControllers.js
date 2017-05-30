const mongoose = require('mongoose');
const promisify = require("es6-promisify");
const passport = require('passport');

const User = mongoose.model('User');

exports.registerForm = (req, res) => {
  res.render('register', { title: "register" });
}

// express validator
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('username');
  req.checkBody('username', 'Invalid Username').notEmpty();
  req.checkBody('email', 'Invalid Email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Password Cannot be Blank').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password Cannot be Blank').notEmpty();
  req.checkBody('password-confirm', 'You passwords do not match').equals(req.body.password);
  next();

  const errors = req.validationErrors();
  if (errors) {
    // req.flash('error', errors.map(err => err.msg) );
    res.render('register', {title: 'Register', body: req.body });
    return;
  }
  next();
}

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, username: req.body.username });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.loginForm = (req, res) => {
  res.render('login', { title: "login" });
}

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed login!',
  successRedirect: '/user',
  successFlash: 'You are now logged in'
});

exports.logout = (req, res) => {
  req.logout()
  // req.flash('success', 'You are now logged out!')
  res.redirect('/login')
}
