const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

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
            token: 0,
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
            forgotTokenExpireIn: 0,
            token: 0
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
const updateUser = async (req, res) => {
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

// status change 
const statusUpdate = async (req, res) => {
    try {
        const { id } =req.params;

        const userData = await userModel.findByIdAndUpdate({_id: id},{$set: {status: req.body.status }});

        if(userData){
            return res.status(200).json({ message: "Status updated successfully.", success: true})
        }else{
            return res.status(404).json({ message: "Record is not found.", success: false })
        }

    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// change password
const changePassword = async (req, res) => {
    try {
        const userData = await userModel.findOne({ _id: req.user._id }).select("-token")

        // password compare
        const isMatch = await bcrypt.compare(req.body.currentPassword, userData.password);
        
        if (!isMatch) {
            return res.status(400).json({ error: ["Incorrect current password."], success: false })
        }

        // new password match for surrent password 
        const oldMatch = await bcrypt.compare(req.body.newPassword, userData.password);
        if (oldMatch) {
            return res.status(400).json({ error: ["New password must be different from the current password."], success: false })
        }
        // password convert hash
        const passwordHash = await bcrypt.hash(req.body.newPassword, 10);

        const updateData = await userModel.findByIdAndUpdate({ _id: userData._id }, { password: passwordHash, $unset: { token: "" } })

        res.status(200).json({ message: "Password updated successfully.", success: true })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}
module.exports = {
    createUser,
    singleUserGet,
    getUsers,
    deleteUser,
    updateUser,
    statusUpdate,
    changePassword
}