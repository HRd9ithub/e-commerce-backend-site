const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const transporter = require('./nodeMailer');
const { SMTP_EMAIL } = process.env;

const verifyEmail = async (email, mailsubject, otp) => {
    // get file path
    const filepath = path.resolve(__dirname, "../../templates/views/otpTemplate.ejs");

    // read file using fs module
    const htmlstring = fs.readFileSync(filepath).toString();
    // add data dynamic
    const content = ejs.render(htmlstring, { otp });

    let from = `D9ithub <${SMTP_EMAIL}>`
    const mailOptions = {
        from: from,
        to: email,
        subject: mailsubject,
        html: content
    };

    const mailSend = await transporter.sendMail(mailOptions)
}

module.exports = verifyEmail;