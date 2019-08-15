const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
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
  namespace: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Namespace' }]
});
module.exports = mongoose.model('Room', roomSchema);
