const mongoose = require('mongoose');
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Please set this environment variable.');
  process.exit(1);
}
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connection Successful'))
  .catch(err => console.error('Connection unsuccessful', err));