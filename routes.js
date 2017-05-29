const express = require('express');
const { catchErrors } = require('./errorHandlers');
const user = require('./controllers/userController');

const router = express.Router();

router.get('/', user.showMain);
router.get('/login', user.showLogin);

router.get('/user', user.showUser);
router.get('/user/upload', user.imageForm);
router.post('/user/upload',
  user.upload,
  catchErrors(user.resize),
  catchErrors(user.saveImage)
);
router.get('/user/:image', catchErrors(user.showImage));

router.get('/user/edit', user.showEditAccount);
// router.post('/user/edit',  user.updateAccount);


module.exports = router;
