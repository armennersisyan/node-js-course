const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');

class DB {
    generateAccessToken(user) {
        return jwt.sign(user, process.env.TOKEN_KEY || 'unKeyed', { expiresIn: '12h' });
    }
    readDB = async () => {
        /**
         * Read and parse DB
         */
        const db = await fs.readFile('./db.json');
        return db.toString() ? JSON.parse(db) : [];
    };
    createUser = async ({
        username,
        password,
        firstName,
        lastName
    }) => {

        /**
         * Validating input
         */
        if (!username) {
            console.log('\x1b[33m%s\x1b[0m', 'Username is required');
            return { error: 'Username is required' }
        }
        if (!password) {
            console.log('\x1b[33m%s\x1b[0m', 'Password is required')
            return { error: 'Password is required' }
        }

        const db = await this.readDB()

        /**
         * Checks if user exists
         */
        if (db.findIndex(u => u.username === username) > -1) {
            console.log('\x1b[31m%s\x1b[0m', 'Oops the username already exists!');
            return { error: 'Oops the username already exists!' }
        }

        /**
         * Crypt Password
         */
        const hashPassword = await bcrypt.hash(password, 10);

        const user = {
            id: uuidv4(),
            username: username,
            password: hashPassword,
            lastName: lastName || '',
            firstName: firstName || '',
        };

        db.push(user);

        /**
         * Adding user to DB
         */
        const dbStringified = JSON.stringify(db, null, 2);
        await fs.writeFile('./db.json', dbStringified);

        console.log('\x1b[32m%s\x1b[0m', 'Congrats! You\'re successfully registered!')
        return user;
    };
    getUser = async ({
        username,
        password
    }) => {
        /**
         * Validating input
         */
        if (!username || !password) {
            console.log('\x1b[33m%s\x1b[0m', 'Please fill the required fields!')
            throw new Error('Please fill the required fields!');
        }

        const db = await this.readDB();

        let isPasswordMatch;
        const user = db.find(u => u.username === username);

        /**
         * Checks if password is correct
         */
        if (user) {
            isPasswordMatch = await bcrypt.compare(password, user.password);
        }

        if (!isPasswordMatch || !user) {
            console.log('\x1b[31m%s\x1b[0m', 'Incorrect username or password!')
            throw new Error('Incorrect username or password!');
        }

        delete user.password;

        console.log('\x1b[32m%s\x1b[0m', `Hi ${user.firstName} ${user.lastName} jan!`)
        return this.generateAccessToken(user)
    }
}

module.exports = new DB()
