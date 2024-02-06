const { check } = require("express-validator");
const userModel = require("../models/userModel");
const categoryModel = require("../models/categoryModel");

//  users
exports.userValidation = [
    check("fullName", "FullName is a required field.").notEmpty(),
    check("email", "Email must be a valid email.").isEmail().custom(async (email, { req }) => {
        const data = await userModel.findOne({ email: req.body.email})

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
        const password = req.body.password;
        if (password !== confirmPassword) {
            throw new Error('Password and Confirm password does not match.');
        }
    })
]

//  user update
exports.userUpdateValidation = [
    check("fullName", "FullName is a required field.").notEmpty(),
    check("email", "Email must be a valid email.").isEmail().custom(async (email, { req }) => {
        const data = await userModel.findOne({ email: req.body.email})
        if (email && data && data._id != req.params.id) {
            throw new Error("Email address already exists.")
        }
    }),
    check("mobileNumber", "Mobile number must be at least 10 character.").isLength({ min: 10, max: 10 }),
    check("address", "Address is a required field.").notEmpty(),
    check("state", "State is a required field.").notEmpty(),
    check("city", "City is a required field.").notEmpty(),
    check("pinCode", "Pincode is a required field.").notEmpty(),
    check("gender", "Gender is a required field.").notEmpty()
]

// status validation
exports.statusValidation = [
    check("status", "Status is a required field.").notEmpty().custom(async (status, { req }) => {
        if (status && status !== "Active" && status !== "Inactive") {
            throw new Error("Invalid status.Please enter the status value for Active or Inactive.")
        }
    }),
]

// authtication
exports.loginValidation = [
    check("email","Email is a required field.").isEmail(),
    check("password","Password is a required field.").notEmpty()
]
// verfiy
exports.verifyValidation = [
    check("email","Email is a required field.").isEmail(),
    check("otp","OTP is a required field.").notEmpty()
]
// verfiy
exports.emailValidation = [
    check("email","Email is a required field.").isEmail(),
]

// reset password validation
exports.resetPasswordValidation = [
    check("email", "Email is a required field.").isEmail(),
    check("password", "Password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    check("confirmPassword", "Confirm password is required").notEmpty().custom(async (confirmPassword, { req }) => {
        const password = req.body.password;
        if (password !== confirmPassword) {
            throw new Error('Password and Confirm password does not match.');
        }
    })
]

exports.passwordValidation = [
    check("currentPassword", "Current Password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    check("newPassword", "New Password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.").isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    check("confirmPassword", "Confirm password is required").notEmpty().custom(async (confirmPassword, { req }) => {
        const password = req.body.newPassword
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if (password !== confirmPassword) {
            throw new Error('New password and Confirm password does not match.')
        }
    })
]


// ------------------------------- category api 

exports.categoryValidation = [
    check("name","Name is a required field.").notEmpty().custom(async (name, { req }) => {
        const data = await categoryModel.findOne({ name: { $regex: new RegExp(name, 'i') }})
        
        if (name && data && data._id !== req.params.id) {
            throw new Error("Category already exists.")
        }
    })
]
// ------------------------------- sub category api 
exports.subCategoryValidation = [
    check("name","Name is a required field.").notEmpty(),
    check("categoryId","CategoryId is a required field.").isMongoId()
]

// ------------------------------- product Api

exports.productValidation = [
    check("name", "Name is a required field.").notEmpty(),
    check("price", "Price is a required field.").notEmpty(),
    check("description", "Description is a required field.").notEmpty(),
    check("stock", "Stock is a required field.").notEmpty(),
    check("categoryId", "Category is a required field.").isMongoId(),
    check('isActive', "Invalid isActive.Please enter the isActive value for true or false.").isIn(["true", "false"]),
]

