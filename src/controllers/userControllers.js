const userModel = require("../models/userModel");

// create user
const createUser = async (req, res) => {
    try {
        const userData = new userModel(req.body)

        await userData.save();

        return res.status(201).json({ message: "Data added successfully.", success: true })
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// single get user
const singleUserGet = async (req, res) => {
    try {
        const { id } =req.params;

        const userData = await userModel.findOne({_id: id, deleteAt : {$exists : false}},{
            password : 0,
            otp: 0,
            expireIn: 0,
            forgotToken: 0,
            forgotTokenExpireIn: 0
        })

        return res.status(200).json({ message: "Data fetch successfully.", success: true, data: userData || {} })
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// all get user
const getUsers = async (req, res) => {
    try {
        const userData = await userModel.find({deleteAt : {$exists : false}},{
            password : 0,
            otp: 0,
            expireIn: 0,
            forgotToken: 0,
            forgotTokenExpireIn: 0
        })

        return res.status(200).json({ message: "Data fetch successfully.", success: true, data: userData || [] })
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// delete user
const deleteUser = async (req, res) => {
    try {
        const { id } =req.params;

        const userData = await userModel.findByIdAndUpdate({_id: id},{$set: {deleteAt: new Date()}});

        if(userData){
            return res.status(200).json({ message: "Data deleted successfully.", success: true})
        }else{
            return res.status(404).json({ message: "Record is not found.", success: false })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update user
const updateUser = async (req, res, next) => {
    try {
        const { id } =req.params;

        req.body.profileImage = req.file ? req.file.filename : req.body.profileImage

        const userData = await userModel.findByIdAndUpdate({_id: id},{$set: req.body});

        if(userData){
            return res.status(200).json({ message: "Data updated successfully.", success: true})
        }else{
            return res.status(404).json({ message: "Record is not found.", success: false })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = {
    createUser,
    singleUserGet,
    getUsers,
    deleteUser,
    updateUser
}