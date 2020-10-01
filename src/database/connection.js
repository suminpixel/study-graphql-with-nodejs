const mongoose = require('mongoose');

const dbUrl = 'mongodb://localhost/studydb';

mongoose.connect(dbUrl);

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected.');
    process.exit(0);
  })
})

require('./schemas/User');
require('./schemas/ConnectedUser');
require('./schemas/Post');
require('./schemas/Like');
require('./schemas/Comment');

