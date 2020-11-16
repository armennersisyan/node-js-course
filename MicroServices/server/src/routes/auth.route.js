const express = require('express');
const router = express.Router();

const { signIn, signUp } = require('../controllers/auth');

router.post('/signup', function (req, res) {
  signUp(req, res);
})
router.post('/signin', function (req, res) {
  signIn(req, res);
})

module.exports = router
