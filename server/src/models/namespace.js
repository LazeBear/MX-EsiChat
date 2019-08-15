const mongoose = require('mongoose');

const namespaceSchema = new mongoose.Schema({
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
  isPrivate: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    minlength: 1,
    maxlength: 6
  },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }]
});
module.exports = mongoose.model('Namespace', namespaceSchema);
