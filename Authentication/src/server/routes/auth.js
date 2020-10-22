const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const express = require('express');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

function generateAccessToken(user) {
    return jwt.sign(user, process.env.TOKEN_KEY || 'unKeyed', { expiresIn: '1h' });
}

async function signIn(req, res, next) {
    try {
        console.log('Sign in request...')
        const { username, password } = req.body;

        /**
         * Validating input
         */
        if (!username || !password) {
            console.log('\x1b[33m%s\x1b[0m', 'Please fill the required fields!')
            return res.status('200').send({ error: 'Please fill the required fields!' })
        }

        /**
         * Read and parse db
         */
        const db = await fs.readFile('./db.json');
        const dbParsed = db.toString() ? JSON.parse(db) : [];

        let isPasswordMatch;
        const user = dbParsed.find(u => u.username === username);

        /**
         * Checks if password is correct
         */
        if (user) {
            isPasswordMatch = await bcrypt.compare(password, user.password);
        }

        if (!isPasswordMatch || !user) {
            console.log('\x1b[31m%s\x1b[0m', 'Incorrect username or password!')
            return res.status('403').send({ error: 'Incorrect username or password!' })
        }

        delete user.password;

        console.log('\x1b[32m%s\x1b[0m', `Hi ${user.firstName} ${user.lastName} jan!`)
        res.status('200').send(generateAccessToken(user))
    }
    catch (err) {
        console.log(err)
    }
}

async function signUp(req, res, next) {
    try {
        const {
            username,
            password,
        } = req.body;

        /**
         * Validating input
         */
        if (!username) {
            console.log('\x1b[33m%s\x1b[0m', 'Username is required')
            return res.status('403').send('Username is required!')
        }
        if (!password) {
            console.log('\x1b[33m%s\x1b[0m', 'Password is required')
            return res.status('403').send('Password is required!')
        }

        /**
         * Crypt Password
         */
        const hashPassword = await bcrypt.hash(password, 10);

        const user = {
            username,
            password: hashPassword,
            lastName: req.body.lastName || '',
            firstName: req.body.firstName || '',
        };

        /**
         * Read and parse db
         */
        const db = await fs.readFile('./db.json');
        const dbParsed = db.toString() ? JSON.parse(db) : [];

        if (dbParsed.findIndex(u => u.username === username) > -1) {
            console.log('\x1b[31m%s\x1b[0m', 'Oops the username already exists!')
            return res.status('403').send('Oops the username already exists!')
        }

        dbParsed.push(user);

        /**
         * Adding user to db
         */
        const dbStringified = JSON.stringify(dbParsed);
        await fs.writeFile('./db.json', dbStringified);

        console.log('\x1b[32m%s\x1b[0m', 'Congrats! You\'re successfully registered!')
        res.status('200').send(req.body || 'No Body to return')
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

authRouter
    .post('/signin', signIn)
    .post('/signup', signUp)

module.exports = authRouter;
