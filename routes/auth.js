const express = require('express');
const router = express.Router();

const auth = require('../controllers/authControllers');

const { catchErrors } = require('../handlers/errors');

router.get('/login/facebook', auth.gotoFacebook);
router.get('/login/facebook/return', auth.logInFacebook);

router.get('/register', auth.registerForm);
router.post('/register',
  auth.validateRegister,
  catchErrors(auth.register),
  auth.login
);

router.get('/login', auth.loginForm);
router.post('/login', auth.login);

router.get('/logout', auth.logout);

// ======== Reset Password ======== //
router.get('/reset', auth.forgotForm);
router.post('/reset', catchErrors(auth.forgot));
router.get('/reset/:token', catchErrors(auth.confirmToken), auth.reset)
router.post('/reset/:token',
  auth.confirmPasswords,
  catchErrors(auth.confirmToken),
  catchErrors(auth.updatePassword)
)

module.exports = router;
