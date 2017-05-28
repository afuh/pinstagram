const express = require('express');
const { catchErrors } = require('./errorHandlers');
const _ = require('./controllers/myControllers');

const router = express.Router();

router.get('/',  _.showMain);
router.get('/login',  _.showLogin);

router.get('/user',  _.showUser);
router.get('/user/edit',  _.showEditAccount);


module.exports = router;
