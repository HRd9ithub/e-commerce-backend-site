const expressValidator = require("express-validator");

exports.errorHandler = async(req,res,next) => {
    const errors = expressValidator.validationResult(req);

    const err = errors.array().map((val) => {
        return val.msg
    })
    // check data validation error
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: err, success: false })
    }
    next();
}