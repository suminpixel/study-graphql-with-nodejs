const { Schema, model } = require('mongoose');

const Like = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
}, { timestamps: true });

module.exports = model('Like', Like);
