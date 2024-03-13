const express = require("express");
const { loginValidation, verifyValidation, emailValidation, resetPasswordValidation } = require("../utils/validation");
const { userLogin, userVerify, resendOTP, forgotPassword, resetPassword, logoutUser } = require("../controllers/authController");
const { errorHandler } = require("../middlewares/errorMiddleware");
const Auth = require("../middlewares/authentication");
const passport = require("passport");

const route = express.Router();

// login route
route.post("/login", loginValidation, errorHandler, userLogin);
route.post("/admin/login", loginValidation, errorHandler, userLogin);

// verify route
route.patch("/otp", verifyValidation, errorHandler, userVerify);

// resend otp api 
route.put('/resend-otp', emailValidation, errorHandler, resendOTP)

// forget password for email verification and send reset link for email api
route.post('/forgot-password', emailValidation, errorHandler, forgotPassword)

// reset password api
route.post('/reset-password', resetPasswordValidation, errorHandler, resetPassword)

//logout api
route.post('/logout', Auth, logoutUser);

// ! Google Login route =====================================================

route.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

route.get('/google/callback', passport.authenticate('google', {
    failureRedirect: process.env.RESET_PASSWORD_CLIENT_URL + "/login",
    successRedirect: process.env.RESET_PASSWORD_CLIENT_URL
}));

route.get('/success', (req, res) => {
    if (req.user) {
        return res.status(200).json({ user: req.user, message: "Logged in successfully." })
    } else {
        return res.status(400).send("error")
    }
})


// ! Facebook Login route =====================================================
route.get('/facebook', passport.authenticate('facebook'));

route.get('/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: process.env.RESET_PASSWORD_CLIENT_URL + "/login",
        successRedirect: process.env.RESET_PASSWORD_CLIENT_URL
    }));

// ! Github Login route =====================================================

route.get('/github', passport.authenticate('github'));

route.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: process.env.RESET_PASSWORD_CLIENT_URL + "/login",
        successRedirect: process.env.RESET_PASSWORD_CLIENT_URL
    }));

module.exports = route;