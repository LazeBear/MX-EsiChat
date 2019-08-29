const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      lowercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    __v: { type: Number, select: false }
  },
  {
    timestamps: true
  }
);

userSchema.methods.hashPassword = async function() {
  this.password = await bcrypt.hash(this.password, 10);
};

userSchema.methods.validatePassword = async function(password) {
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
