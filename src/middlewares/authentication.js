const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const SECRET_KEY = process.env.SECRET_KEY;

async function Auth(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send("Authorization failed. No access token.");
    }
    try {
        const token = authorization.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Invalid Token Format'
            })
        }
        const decode = jwt.verify(token, SECRET_KEY);
        if (decode) {
            const data = await userModel.findOne({ _id: decode._id }).select("-password")
            if (data) {
                if (data.token == token && data.status === "Active" && !data.deleteAt) {
                    req.user = data
                    next()
                } else {
                    return res.status(401).json({ message: "Unauthenticated.", success: false })
                }
            } else {
                return res.status(401).json({ message: "Unauthenticated.", success: false })
            }
        }
        else {
            return res.status(401).json({ message: "Unauthenticated.", success: false })
        }
    } catch (error) {
        res.status(500).json({
            message:  error.message || 'Internal server Error',
            stack: error.stack
        });
    }
}

module.exports = Auth