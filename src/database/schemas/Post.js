const { Schema, model } = require('mongoose');

const Post = new Schema({
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    index: true,
  }],
  contents: {
    type: String,
    required: true,
  },
  writer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
}, { timestamps: true })

Post.virtual('id').get(function() {
  return this._id;
});

module.exports = model('Post', Post);
