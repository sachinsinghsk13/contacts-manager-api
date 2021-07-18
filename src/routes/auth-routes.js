const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const userRepo = require('../repositories/user-repo');
const { sendVerificationMail } = require('../utils/email-sender');
const { CustomMessage } = require('../utils/util-classes');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../utils/constants');

router.post('/register', async (req, res) => {
    try {
        let user = req.body;
        let result = await userRepo.registerUser(user);
        if (result.token && result.userId) {
            // send a verification mail to user
            sendVerificationMail(user.email, result.token);
            res.json(new CustomMessage(true, 'Registration Successful! You will receive an email verification link soon.'));
        } else {
            res.json(result);
        }
    } catch (error) {
        res.status(500).json(new CustomMessage(false, error.message)).end();
    }
});

router.get('/verify-email', async (req, res) => {
    try {
        const token = req.query.token;
        const result = await userRepo.getUserByVerificationToken(token);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json(new CustomMessage(false, 'Something Went Wrong!'));
    }

});

router.post('/login', async (req, res) => {
    try {
        const credentials = req.body;
        let fetchedUser = await userRepo.getUserByEmail(credentials.username);
        if (fetchedUser.length > 0) {
            if (bcrypt.compareSync(credentials.password, fetchedUser[0].password)) {
                let payload = await userRepo.getUserDetailsByEmail(credentials.username);
                let token = jsonwebtoken.sign({}, TOKEN_SECRET, {
                    algorithm: 'HS256',
                    expiresIn: '7d',
                    subject: credentials.username,
                    issuer: 'Tech JS pvt. ltd.',
                });
                res.json({
                    status: true,
                    message: 'Authentication Successful.',
                    token: token,
                    user: payload
                });
            } else {
                res.json({
                    status: false,
                    message: 'Password is incorrect'
                });
            }
        } else {
            res.json({
                status: false,
                message: 'User Not Found'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            messgae: 'Something went wrong'
        });
    }
});

module.exports = router;