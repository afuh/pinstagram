const express = require('express');
const { catchErrors } = require('./handlers/errors');
const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');

const router = express.Router();

router.get('/', catchErrors(img.recentImages));

router.get('/login/facebook', auth.gotoFacebook);
router.get('/login/facebook/return', auth.backfromFacebook);

router.get('/register', auth.registerForm);
router.post('/register',
  auth.validateRegister,
  auth.register,
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

router.get('/:user/upload', auth.isLoggedIn, img.imageForm);
router.post('/:user/upload',
  img.upload,
  catchErrors(img.resize),
  catchErrors(img.saveImage)
);
router.get('/p/:image', catchErrors(img.showImage));

router.get('/:user/likes', auth.isLoggedIn, catchErrors(user.showLikedImages))

/* API */

router.post('/api/comment/:id', catchErrors(comment.addComment));

router.get('/api/:user/followers', catchErrors(user.showFollowers))
router.get('/api/:user/following', catchErrors(user.showFollowing))

router.post('/api/:user/follow',
  catchErrors(user.findProfile),
  catchErrors(user.follow)
)

router.post('/api/like/:id',
  catchErrors(img.findImg),
  catchErrors(img.addLike),
  catchErrors(img.addToUserLikes)
);

router.get('/api/like/:id/show', catchErrors(img.showLikes))

module.exports = router;
