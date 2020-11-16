const AuthModel = require('../models/auth');
const mongoose = require('mongoose');

class Auth {
  signUp = async (req, res) => {
    const { username, firstName, lastName, password } = req.body;
    try {
      // Find an existing user
      let user = await AuthModel.findOne({ username });
      if (user) return res.status(400).json({
        msg: 'User already registered!'
      });

      user = new AuthModel({
        _id: mongoose.Types.ObjectId(),
        firstName,
        lastName,
        username,
        password,
      })

      user.save().then((u) => {
        res.status(200).json({
          msg: 'Success',
          data: u,
        });
      });
    }
    catch (err) {
      throw err;
    }
  }
  signIn = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await AuthModel.findOne({ username });
      if (!user) {
        res.status(400).json({
          msg: 'User not found!',
        });
      }

      const isMatch = await user.comparePasswords(password);
      if (isMatch) {
        const token = user.generateAuthToken(user);
        res.status(200).json({
          msg: 'Sign in success',
          token,
        });
      } else {
        res.status(400).json({
          msg: 'User not found!',
        });
      }
    }
    catch (err) {
      throw err;
    }
  }
}

module.exports = new Auth();

