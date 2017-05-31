/* eslint-disable no-console */
const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors')
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE);
mongoose.plugin(mongodbErrorHandler);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🚫 → ${err.message}`);
});

require('./models/User');
require('./models/Image');
require('./models/Comment');

const app = require('./app');

app.set('port', process.env.PORT || 3000);
const server = app.listen(app.get('port'), () => {
  console.log('\x1b[33m%s\x1b[0m', `Express running → PORT ${server.address().port}`);
});
