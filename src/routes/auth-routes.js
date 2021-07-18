const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const userRepo = require('../repositories/user-repo');
const { sendVerificationMail } = require('../utils/email-sender');
const { CustomMessage } = require('../utils/util-classes');
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

});

module.exports = router;