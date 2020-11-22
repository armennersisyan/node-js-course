const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const AuthSchema = new mongoose.Schema({
  _id:  mongoose.Types.ObjectId,
  firstName: {
    type: String,
    required: true,
    maxlength: 255,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 255
  },
  username: {
    type: String,
    required: true,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
});

AuthSchema.pre('save', async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

AuthSchema.methods.comparePasswords = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  if (!isMatch) {
    console.log('Password doesn\'t match')
  }
  return isMatch
};

AuthSchema.methods.generateAuthToken = function (user) {
  return jwt.sign({ user }, 'tesla', { expiresIn: '12h' });
}

module.exports = mongoose.model('AuthModel', AuthSchema);
