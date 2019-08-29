const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String
  },
  user: {
    type: String,
    ref: 'User'
  },
  name: { type: String },
  time: { type: Date, index: true },
  room: { type: String, ref: 'Room' },
  __v: { type: Number, select: false }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
