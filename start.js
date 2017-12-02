/* eslint-disable no-console */

/* Credits */
// Icons made by Madebyoliver http://www.flaticon.com/authors/madebyoliver
// Loader by SamHerbert http://samherbert.net/svg-loaders/
// Email template by Wes Bos http://wesbos.com

const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors')
require('dotenv').config({ path: 'variables.env' });


mongoose.connect(process.env.DATABASE, { useMongoClient: true})
mongoose.Promise = global.Promise

mongoose.connection.on('error', err => {
  console.error(`→ ${err.message}`);
});

mongoose.plugin(mongodbErrorHandler);

require('./models/User');
require('./models/Image');
require('./models/Comment');

const app = require('./app');

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('\x1b[34m%s\x1b[0m', `
  Port      → http://localhost:${PORT}
  Database  → ${mongoose.connection.host}/${mongoose.connection.name}
  `
))
