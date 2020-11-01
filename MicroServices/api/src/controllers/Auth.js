const DB = require('../DB');

class Auth {
    signUp = async (ctx, next) => {
        try {
            const user = { ...(await DB.createUser(ctx.request.body)) };
            delete user.password;
            ctx.status = 200;
            ctx.body = user;
        }
        catch (err) {
            throw err;
        }
    }
    signIn = async (ctx, next) => {
        try {
            const token = { token: await DB.getUser(ctx.request.body) };
            ctx.status = 200;
            ctx.body = token;
        }
        catch (err) {
            throw err;
        }
    }
}

module.exports = new Auth();

