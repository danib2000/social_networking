const mongoose = require('mongoose');
const UserSchema = require('../modules/User')

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  subgroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
  }],
});

module.exports = mongoose.model('Group', groupSchema);