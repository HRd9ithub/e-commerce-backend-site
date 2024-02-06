
const nodemailer = require('nodemailer');
const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD
    }
});

module.exports = transporter;