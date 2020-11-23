const express = require('express');
const router = express.Router();

const authRouter = require('./auth.route');
// const chatRouter = require('./chat.route');

router.use(authRouter);
// router.use(chatRouter);

module.exports = router;
