const express = require('express');
const router = express.Router();

const { catchErrors } = require('../handlers/errors');

const comment = require('../controllers/commentControllers');
const notify = require('../controllers/notificationControllers');
const auth = require('../controllers/authControllers');
const user = require('../controllers/userControllers');
const img = require('../controllers/imageControllers');

// router.all("*")

// ======== Comment ======== //
router.post('/comment/:id',
  catchErrors(comment.addComment),
  catchErrors(notify.addNotification)
);
router.get('/comment/:id/remove', auth.isLoggedIn, catchErrors(comment.removeComment));

// ======== Follow ======== //
router.get('/:user/followers', catchErrors(user.showFollowers))
router.get('/:user/following', catchErrors(user.showFollowing))
router.post('/:user/follow',
  catchErrors(user.findProfile),
  catchErrors(user.follow),
  catchErrors(notify.addNotification)
);

// ======== Notifications ======== //
router.get('/notifications/', auth.isLoggedIn, catchErrors(notify.showNotifications));
router.get('/notifications/clear', auth.isLoggedIn, catchErrors(notify.clearNotifications));

// ======== Likes ======== //
router.post('/like/:id',
  catchErrors(img.findImg),
  catchErrors(img.addLike),
  catchErrors(notify.addNotification)
);

router.get('/p/:image/likes', catchErrors(img.showLikes))

// ======== Avatar ======== //
router.post('/avatar',
  img.upload,
  catchErrors(img.makeAvatar),
  catchErrors(user.saveAvatar)
);

router.get('/remove-avatar-confirm', auth.isLoggedIn, catchErrors(user.removeAvatar))

// ======== Upload Image ======== //
router.post('/upload',
auth.isLoggedIn,
img.upload,
catchErrors(img.resize),
catchErrors(img.saveImage)
);



module.exports = router;
