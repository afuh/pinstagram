/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

// mongoose.connect(process.env.DATABASE);
// mongoose.Promise = global.Promise; //

mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

/* Schemas */

const app = require('./app');

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log('\x1b[33m%s\x1b[0m', `Express running → PORT ${server.address().port}`);
});
