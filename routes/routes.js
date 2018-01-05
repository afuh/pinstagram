const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errors');

const img = require('../controllers/imageControllers');
const auth = require('../controllers/authControllers');
const user = require('../controllers/userControllers');
const comment = require('../controllers/commentControllers');
const notify = require('../controllers/notificationControllers');


// ======== Home ======== //
router.get('/', auth.isLoggedIn, catchErrors(img.recentImages));

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
router.get('/p/:image/like', catchErrors(img.showLike))

router.get('/p/:image/remove', catchErrors(img.removeQuestion));
router.get('/p/:image/remove-confirm',
  auth.isLoggedIn,
  catchErrors(img.removeImage),
  catchErrors(notify.removeNotification)
);

router.get('/comment/:id/remove', auth.isLoggedIn, catchErrors(comment.removeComment));

// ======== Navbar ======== //
router.get('/likes', auth.isLoggedIn, catchErrors(user.showLikedImages))

router.get('/notifications/', auth.isLoggedIn, catchErrors(notify.showNotifications));

router.get('/upload', auth.isLoggedIn, img.imageForm);

// ======== Discover people ======== //
router.get('/discover', auth.isLoggedIn, catchErrors(user.discoverPeople));


module.exports = router;
