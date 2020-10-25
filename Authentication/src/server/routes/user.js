const fs = require('fs').promises;
const express = require('express');
const jwt = require('jsonwebtoken');
const userRouter = express.Router();

async function updateUser(req, res, next) {
    try {
        const { userId } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const { id, role } = jwt.verify(token, process.env.TOKEN_KEY || 'unKeyed');

        /**
         * Read and parse db
         */
        const db = await fs.readFile('./db.json');
        const dbParsed = db.toString() ? JSON.parse(db) : [];

        /**
         * Finds the user,
         * if userId exists then it updates user with given userId
         * else it updates Authenticated user
         */
        let user;

        if (!userId) {
            user = dbParsed.find(u => u.id === id);
        } else {
            if (role === 'admin') {
                user = dbParsed.find(u => u.id === userId);
            } else {
                console.log('\x1b[31m%s\x1b[0m', 'Permission denied');
                return res.status('403').send('Permission denied');
            }
        }

        if (!user) {
            console.log('\x1b[31m%s\x1b[0m', 'User not found!');
            return res.status('403').send('User not found!');
        }

        const {
            lastName,
            firstName,
        } = req.body;

        /**
         * Modify and update user data
         */
        user.lastName = lastName;
        user.firstName = firstName;
        const dbStringified = JSON.stringify(dbParsed, null, 2);
        await fs.writeFile('./db.json', dbStringified);

        res.send(user);
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

async function deleteUser(req, res, next) {
    try {
        const { userId } = req.params;
        const token = req.headers.authorization.split(' ')[1];
        const { id, role } = jwt.verify(token, process.env.TOKEN_KEY || 'unKeyed');

        /**
         * Check if the inputed ID is current user's ID
         * or if the user is admin
         */
        if (id !== userId && role !== 'admin') {
            console.log('\x1b[31m%s\x1b[0m', 'Permission denied');
            return res.status('403').send('Permission denied');
        }

        /**
         * Read and parse db
         */
        const db = await fs.readFile('./db.json');
        const dbParsed = db.toString() ? JSON.parse(db) : [];

        /**
         * Delete user
         */
        const deletedList = dbParsed.filter(u => u.id !== userId);

        /**
         * Checks if user is deleted
         */
        if (dbParsed.length === deletedList.length) {
            console.log('\x1b[31m%s\x1b[0m', 'User not found!');
            return res.status('403').send('User not found!');
        }

        /**
         * Update db with deleted user
         */
        const dbStringified = JSON.stringify(deletedList, null, 2);
        await fs.writeFile('./db.json', dbStringified);

        console.log('\x1b[32m%s\x1b[0m', 'Successfully Deleted!');
        return res.status('403').send('Successfully Deleted!');
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

userRouter
    .put('/user/:userId?', updateUser)
    .delete('/user/:userId?', deleteUser)

module.exports = userRouter;
