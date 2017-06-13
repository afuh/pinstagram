const express = require('express');
const { catchErrors } = require('./handlers/errors');
const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');
const notify = require('./controllers/notificationControllers');

const router = express.Router();

router.get('/', catchErrors(img.recentImages));
router.get('/page/:page', catchErrors(img.recentImages));

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

// forgot password
router.get('/reset', auth.forgotForm);
router.post('/reset', catchErrors(auth.forgot));
router.get('/reset/:token', catchErrors(auth.confirmToken), auth.reset)
router.post('/reset/:token',
  auth.confirmPasswords,
  catchErrors(auth.confirmToken),
  catchErrors(auth.updatePassword)
)

// change password
router.get('/:user/password', auth.isLoggedIn, auth.reset);
router.post('/:user/password',
  auth.confirmPasswords,
  catchErrors(auth.updatePassword)
)


router.get('/:user', catchErrors(user.showProfile));

router.get('/edit', auth.isLoggedIn, user.showUserData);
router.post('/edit', catchErrors(user.updateAccount));

router.get('/p/:image', catchErrors(img.showImage));
router.get('/p/:image/remove', catchErrors(img.removeQuestion));
router.get('/p/:image/remove-confirm', auth.isLoggedIn, catchErrors(img.removeImage));

router.get('/:user/likes', auth.isLoggedIn, catchErrors(user.showLikedImages))

// change avatar
router.post('/:user',
  img.upload,
  catchErrors(img.makeAvatar),
  catchErrors(user.saveAvatar)
);


/* API */
router.get('/api/:user/upload', auth.isLoggedIn, img.imageForm);
router.post('/api/:user/upload',
  img.upload,
  catchErrors(img.resize),
  catchErrors(img.saveImage)
);

router.post('/api/comment/:id',
  catchErrors(comment.addComment),
  catchErrors(notify.addNotification)
);

router.get('/api/comment/:id/remove', auth.isLoggedIn, catchErrors(comment.removeComment));
router.get('/api/remove-avatar-confirm', auth.isLoggedIn, catchErrors(user.removeAvatar))

router.get('/api/:user/followers', catchErrors(user.showFollowers))
router.get('/api/:user/following', catchErrors(user.showFollowing))

router.post('/api/:user/follow',
  catchErrors(user.findProfile),
  catchErrors(user.follow),
  catchErrors(notify.addNotification)
);

router.get('/api/:user/notifications/', catchErrors(notify.showNotifications));
router.get('/api/:user/notifications/clear', catchErrors(notify.clearNotifications));

router.post('/api/like/:id',
  catchErrors(img.findImg),
  catchErrors(img.addLike),
  catchErrors(notify.addNotification)
);

router.get('/api/like/:id/show', catchErrors(img.showLikes))


module.exports = router;
