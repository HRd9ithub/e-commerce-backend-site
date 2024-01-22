const { check } = require("express-validator");
const userModel = require("../models/userModel");


exports.userValidation = [
    check("fullName", "FullName is a required field.").notEmpty(),
    check("email", "Email must be a valid email.").isEmail().custom(async (email, { req }) => {
        const data = await userModel.findOne({ email: { $regex: new RegExp('^' + req.body.email, 'i') } })

        if (email && data) {
            throw new Error("Email address already exists.")
        }
    }),
    check("mobileNumber", "Mobile number must be at least 10 character.").isLength({ min: 10, max: 10 }),
    check("password", "Password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    check("confirmPassword", "Confirm password is required").notEmpty().custom(async (confirmPassword, { req }) => {
        const password = req.body.password
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if (password !== confirmPassword) {
            throw new Error('New Password and Confirm Password does not match.')
        }
    })
    // check('role_id', "Role id is Required.").isMongoId(),
]

exports.passwordValidation = [
    check("current_password", "Current Password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    check("new_password", "New Password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    check("confirm_password", "Confirm password is required").notEmpty().custom(async (confirmPassword, { req }) => {
        const password = req.body.new_password
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if (password !== confirmPassword) {
            throw new Error('New Password and Confirm Password does not match.')
        }
    })
]