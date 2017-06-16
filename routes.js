const express = require('express');
const { catchErrors } = require('./handlers/errors');
const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');
const notify = require('./controllers/notificationControllers');

const router = express.Router();

// ======== Login / Register ======== //
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

// ======== Reset Password ======== //
router.get('/reset', auth.forgotForm);
router.post('/reset', catchErrors(auth.forgot));
router.get('/reset/:token', catchErrors(auth.confirmToken), auth.reset)
router.post('/reset/:token',
  auth.confirmPasswords,
  catchErrors(auth.confirmToken),
  catchErrors(auth.updatePassword)
)

// ======== Change Password ======== //
router.get('/change-password', auth.isLoggedIn, auth.passwordForm)
router.post('/change-password',
  auth.username,
  auth.passwordCheck,
  catchErrors(auth.generateUrl)
)

// ======== User profile ======== //
router.get('/:user', catchErrors(user.showProfile));

router.get('/edit', auth.isLoggedIn, user.showUserData);
router.post('/edit', catchErrors(user.updateAccount));

router.get('/:user/followers', catchErrors(user.showFollowers))
router.get('/:user/following', catchErrors(user.showFollowing))

// ======== Image ======== //
router.get('/p/:image', catchErrors(img.showImage));
router.get('/p/:image/likes', catchErrors(img.showLikes))

router.put('/p/:image/remove', catchErrors(img.removeQuestion));
router.get('/p/:image/remove-confirm',
  auth.isLoggedIn,
  catchErrors(img.removeImage),
  catchErrors(img.removeNotification)
);

router.get('/comment/:id/remove', auth.isLoggedIn, catchErrors(comment.removeComment));

// ======== Navbar ======== //
router.get('/likes', auth.isLoggedIn, catchErrors(user.showLikedImages))

router.get('/notifications/', auth.isLoggedIn, catchErrors(notify.showNotifications));

router.get('/upload', auth.isLoggedIn, img.imageForm);
router.post('/upload',
  auth.isLoggedIn,
  img.upload,
  catchErrors(img.resize),
  catchErrors(img.saveImage)
);



// **********
// API
// **********

// ======== Comment ======== //
router.post('/api/comment/:id',
  catchErrors(comment.addComment),
  catchErrors(notify.addNotification)
);
router.get('/api/comment/:id/remove', auth.isLoggedIn, catchErrors(comment.removeComment));

// ======== Follow ======== //
router.get('/api/:user/followers', catchErrors(user.showFollowers))
router.get('/api/:user/following', catchErrors(user.showFollowing))
router.post('/api/:user/follow',
  catchErrors(user.findProfile),
  catchErrors(user.follow),
  catchErrors(notify.addNotification)
);

// ======== Notifications ======== //
router.get('/api/notifications/', auth.isLoggedIn, catchErrors(notify.showNotifications));
router.get('/api/notifications/clear', auth.isLoggedIn, catchErrors(notify.clearNotifications));

// ======== Likes ======== //
router.post('/api/like/:id',
  catchErrors(img.findImg),
  catchErrors(img.addLike),
  catchErrors(notify.addNotification)
);

router.get('/api/p/:image/likes', catchErrors(img.showLikes))

// ======== Avatar ======== //
router.post('/:user',
  img.upload,
  catchErrors(img.makeAvatar),
  catchErrors(user.saveAvatar)
);
router.get('/api/remove-avatar-confirm', auth.isLoggedIn, catchErrors(user.removeAvatar))

module.exports = router;
