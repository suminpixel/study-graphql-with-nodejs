const { Schema, model } = require('mongoose');

//로그인한 본인 현재 유저의 모델은 따로 분리하여관리
const ConnectedUser = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  grantedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = model('ConnectedUser', ConnectedUser);
