const { Schema, model } = require('mongoose');

const User = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  profileImageUrl: String,
}, { timestamps: true });

module.exports = model('User', User);
