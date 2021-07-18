const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sachinsinghsk369',
        pass: 'SINGH.YOYO99'
    }
});

module.exports.sendVerificationMail = function (email, token) {
    transporter.sendMail({
        from: 'sachinsinghsk369',
        to: email,
        subject: 'Please Verify Your Email to login to Contact Manager',
        html: `
            <html>
            <head>
            <style>
                a {
                    padding: 1rem;
                    border: none;
                    background-color: crimson;
                    color: white !important;
                    font-weight: bold;
                    font-size: 1.2rem;
                }
            </style>
            </head>
            <body>
            <h1>Hi, Thanks for Registering on Contact Manager</h1>
            <h3>Click on below link to active your account.</h3>
            <a href="http://localhost:8900/auth/verify-email?token=${token}">Active Account</a>"
            </body>
            </html>
        
        `
    })
}