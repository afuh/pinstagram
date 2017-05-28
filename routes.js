const express = require('express');
const { catchErrors } = require('./errorHandlers');
const _ = require('./controllers/myControllers');

const router = express.Router();

router.get('/',  _.showMain);
router.get('/user',  _.showUser);


module.exports = router;
