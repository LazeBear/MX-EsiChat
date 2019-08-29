const mongoose = require('mongoose');

const namespaceSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: ''
    },
    color: {
      type: String
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      minlength: 1,
      maxlength: 6
    },
    __v: { type: Number, select: false }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('Namespace', namespaceSchema);
