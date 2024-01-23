const otpGenerator = require('otp-generator');
const verifyEmail = require("../utils/2FAEmail");
const userModel = require("../models/userModel");
const forgotEmail = require("../utils/forgotEmail");
const bcrypt = require("bcrypt");

// login function
const userLogin = async (req, res) => {
    try {
        // email check exist or not
        const userData = await userModel.findOne({ email: req.body.email, status: "Active" });

        if (!userData) {
            return res.status(404).json({ message: "Invalid email or password.", success: false })
        }

        // password compare
        const isMatch = await userData.comparePassword(req.body.password);

        if (!isMatch) {
            return res.status(404).json({ message: "Invalid email or password.", success: false })
        }

        const mailsubject = 'Verification Code';

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        // mail send function
        const result = await verifyEmail(req.body.email, mailsubject, otp);

        const response = await userModel.findByIdAndUpdate({ _id: userData._id }, { otp, expireIn: new Date().getTime() + 5 * 60000, $unset: { token: 1 } }, { new: true })

        return res.status(200).json({ success: true, message: "OTP sent successfully.", data: response.email })

    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// verify user
const userVerify = async (req, res) => {
    try {
        // get data for email
        const data = await userModel.findOne({ email: req.body.email, otp: req.body.otp });

        if (data) {
            const currTime = new Date().getTime()
            const diff = data.expireIn - currTime

            if (diff < 0) {
                return res.status(400).json({ message: "OTP has expired.", success: false })
            }

            // generate token
            const token = await data.generateToken();

            const response = await userModel.findByIdAndUpdate({ _id: data._id }, { $unset: { otp: 1, expireIn: 1 }, $set: { token } }, { new: true })
            return res.status(200).json({ success: true, message: "Logged in successfully.", token: token, id: response._id })
        } else {
            // not match send message
            return res.status(400).json({ message: "OTP is invalid.", success: false })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// RESEND otp 
const resendOTP = async (req, res) => {
    try {
        // get data for email
        const data = await userModel.findOne({ email: req.body.email });

        if (!data) {
            return res.status(404).json({ message: "Account not found with the provided email.", success: false });
        }

        const mailsubject = 'Verification Code';

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

        // mail send function
        const result = await verifyEmail(data.email, mailsubject, otp);

        const response = await userModel.findByIdAndUpdate({ _id: data._id }, { otp, expireIn: new Date().getTime() + 5 * 60000, $unset: { token: 1 } }, { new: true })
        return res.status(200).json({ success: true, message: "OTP sent successfully." })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// forgot password
const forgotPassword = async (req, res) => {
    try {
        // email check exist or not
        const userData = await userModel.findOne({ email: req.body.email })

        if (userData) {
            // generate token
            const token = await userData.generateToken();

            const mailsubject = 'Reset Password';
            // mail content
            const url = `${process.env.RESET_PASSWORD_URL}/reset-password?email=${req.body.email}&token=${token}`

            // mail send function
            const result = await forgotEmail(req.body.email, mailsubject, url);

            const response = await userModel.findByIdAndUpdate({ _id: userData._id }, {$set: { forgotToken :token, forgotTokenExpireIn : new Date().getTime() + 30 * 60000 } }, { new: true })

            return res.status(200).json({ success: true, message: "A password reset link has been emailed to you." })
        } else {
            // email not match send message
            return res.status(404).json({ message: "Account not found with the provided email.", success: false })

        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// reset password function
const resetPassword = async (req, res) => {
    try {
        const TokenArray = req.headers['authorization'];

        if (!TokenArray) return res.status(400).json({ success: false, message: "Token is a required field." })
        const token = TokenArray.split(" ")[1];
    
        if (!token) return res.status(400).json({ success: false, message: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent." })

        const data = await userModel.findOne({
            email: req.body.email,
            forgotToken: token,
        },{forgotToken : 1, forgotTokenExpireIn : 1});

        if (!data) return res.status(400).json({ message: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent.",  success: false })
        
        const currTime = new Date().getTime()
        
        const diff = data.forgotTokenExpireIn - currTime
        
        if (diff > 0) {
            // password convert hash
            const passwordHash = await bcrypt.hash(req.body.password, 10)
            const response = await userModel.findByIdAndUpdate({ _id: data._id }, { $set : {password: passwordHash},$unset : {forgotToken : 1, forgotTokenExpireIn : 1} }, { new: true })
            return res.status(200).json({ success: true, message: "Password reset successfully." })
        } else {
           return res.status(400).json({ message: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent.",  success: false })
        } 
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = {
    userLogin,
    userVerify,
    resendOTP,
    forgotPassword,
    resetPassword
}