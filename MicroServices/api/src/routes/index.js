const Router = require('koa-router');
const router = new Router();

const Auth = require('../controllers/Auth');

router
    .post('/signup', (ctx, next) => Auth.signUp(ctx, next))
    .post('/signin', (ctx, next) => Auth.signIn(ctx, next))

module.exports = router;
