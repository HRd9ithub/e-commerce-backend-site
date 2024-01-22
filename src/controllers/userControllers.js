const expressValidator = require("express-validator");
const userModel = require("../models/userModel");


const createUser = async (request, response, next) => {
    try {
        const errors = expressValidator.validationResult(request)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return response.status(422).json({ error: err, success: false })
        }

        const userData = new userModel(request.body)

        await userData.save();

        return response.status(201).json({ message: "Data added successfully.", success: true })
    } catch (error) {
        return response.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = {
    createUser
}