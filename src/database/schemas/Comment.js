const { Schema, model } = require('mongoose');

const Comment = new Schema({
  contents: {
    type: String,
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    index: true,
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
}, { timestamps: true });

Comment.virtual('id').get(function() {
  return this._id;
});

module.exports = model('Comment', Comment);
