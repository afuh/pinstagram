const express = require('express');
const { catchErrors } = require('./handlers/errors');
const user = require('./controllers/userController');
const auth = require('./controllers/authController');

const router = express.Router();

router.get('/', catchErrors(user.recentImages));

router.get('/register', auth.registerForm);
router.post('/register',
  auth.validateRegister,
  catchErrors(auth.register),
  auth.login
);

router.get('/login', auth.loginForm);
router.post('/login', auth.login);

router.get('/logout', auth.logout);

router.get('/user', catchErrors(user.showUser));
router.get('/user/upload', user.imageForm);
router.post('/user/upload',
  user.upload,
  catchErrors(user.resize),
  catchErrors(user.saveImage)
);
router.get('/user/p/:image', catchErrors(user.showImage));

router.get('/user/edit', user.showEditAccount);
// router.post('/user/edit',  user.updateAccount);


module.exports = router;
