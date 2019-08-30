const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true
    },
    name: {
      type: String,
      required: true,
      minlength: 2
    },
    inviteOnly: {
      type: Boolean,
      default: false
    },
    user: {
      type: String,
      ref: 'User'
    },
    createdBy: { type: String },
    namespace: { type: String, ref: 'Namespace' },
    __v: { type: Number, select: false }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Room', roomSchema);
