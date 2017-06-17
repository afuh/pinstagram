const mongoose = require('mongoose');
const promisify = require("es6-promisify");
const passport = require('passport');
const crypto = require('crypto');

const mail = require('../handlers/mail');
const User = mongoose.model('User');

// ======== Facebook  ======== //
exports.gotoFacebook = passport.authenticate('facebook', {  scope: ['email']});
exports.logInFacebook = passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'You are now logged in'
});

// ======== Local ======== //
exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Invalid username or password',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'You are now logged out!')
  res.redirect('/login')
}

// ======== Autenticate ======== //
exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('info', 'Please log in to continue');
  res.redirect('/login');
}


// ======== Register validator ======== //
// express-validator
exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('username');
  req.checkBody('username', 'Please supply an username').notEmpty();
  req.checkBody('username', 'Invalid Username').isAlphanumeric();

  req.checkBody('email', 'Invalid Email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    gmail_emove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });

  req.checkBody('password', 'Password Cannot be Blank').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password Cannot be Blank').notEmpty();
  req.checkBody('password-confirm', 'You passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map(err => err.msg) );
    res.render('register', {title: 'Register', body: req.body, flashes: req.flash() });
    return;
  }
  next();
}

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, username: req.body.username });
  const register = promisify(User.register, User); // passport-local-mongoose
  await register(user, req.body.password);
  next();
};

// ======== Login / Register forms ======== //
exports.loginForm = (req, res) => {
  res.render('login', { title: "Login" });
}

exports.registerForm = (req, res) => {
  res.render('register', { title: "Register" });
}

// ======== Reset Password ======== //

// ask the user for the email
exports.forgotForm = (req, res) => {
  res.render('forgot', {title: 'Change your Password'} )
}

// if the email is true, set the tokens and generate an URL to send it to the user per email
exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', "That e-mail address doesn't have an associated user account. Are you sure you've registered?")
    return res.redirect('/login')
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000 // 1 hour from now
  await user.save();

  const resetURL = `http://${req.headers.host}/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    subject: 'Password reset',
    resetURL,
    filename: 'password-reset',
  });

  req.flash('success', "You have been emailed a password reset link")
  res.redirect('/login');
}

// middlewar to confirm the tokens
exports.confirmToken = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) {
    req.flash('error', 'Password reset is invalid or has expired')
    return res.redirect('/login');
  }
  req.body.user = user;
  next()
}

// if the tokens are true, show the reset form
exports.reset = (req, res) => {
  res.render('reset', { title: 'Change your Password' });
}

// double check the new password
exports.confirmPasswords = (req, res, next) => {
  if (req.body.password === req.body.confirm) return next();
  req.flash('error', 'Password do not match!');
  res.redirect('back');
}

// update the User and delete the tokens
exports.updatePassword = async (req, res) => {
  const user = req.body.user || req.user;

  // passport-local-mongoose
  const setPassword = promisify(user.setPassword, user)
  await setPassword(req.body.password)

  // reset the tokens
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updateUser = await user.save()
  await req.login(updateUser);

  req.flash('success', 'Your password has been reset!');
  res.redirect(`/${user.slug}`);
}

// ======== Change Password ======== //
exports.passwordForm = (req, res) => {
  res.render('password', {title: 'Change your Password'})
}

exports.username = (req, res, next) => {
  req.body.username = req.user.username;
  next()
}

exports.passwordCheck = passport.authenticate('local', {
  failureRedirect: 'back',
  failureFlash: 'Invalid password'
})

exports.generateUrl = async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    req.flash('error', "Something went terribly wrong")
    return res.redirect('/login')
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 300000 // 5 minutes from now
  await user.save();

  res.redirect(`/reset/${user.resetPasswordToken}`);
}
