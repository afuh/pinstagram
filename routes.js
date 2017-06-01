const express = require('express');
const { catchErrors } = require('./handlers/errors');
const img = require('./controllers/imageControllers');
const auth = require('./controllers/authControllers');
const user = require('./controllers/userControllers');
const comment = require('./controllers/commentControllers');

const router = express.Router();

router.get('/', catchErrors(img.recentImages));

router.get('/register', auth.registerForm);
router.post('/register',
  auth.validateRegister,
  catchErrors(auth.register),
  auth.login
);

router.get('/login', auth.loginForm);
router.post('/login', auth.login);
router.get('/logout', auth.logout);

router.get('/:user', catchErrors(user.showUser));

router.get('/edit', user.showUserData);
router.post('/edit', catchErrors(user.updateAccount));

router.get('/:user/upload', img.imageForm);
router.post('/:user/upload',
  img.upload,
  catchErrors(img.resize),
  catchErrors(img.saveImage)
);
router.get('/:user/p/:image', catchErrors(img.showImage));

router.post('/comment/:id', catchErrors(comment.addComment));

router.post('/like/:id', catchErrors(img.addLike));

router.get('/:user/likes', catchErrors(user.showLikedImages))

module.exports = router;
