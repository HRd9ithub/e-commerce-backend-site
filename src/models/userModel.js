const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userModel = new Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    mobileNumber: {
        type: Number,
        require: true
    },
    profileImage: {
        type: String,
        default: "Images/default.jpg"
    },
    address: {
        type: String,
    },
    country: {
        type: String,
        default: "India",
    },
    state: {
        type: String,
        enum: ['Active', 'Inactive'],
        default : "Active"
    },
    city: {
        type: String,
    },
    pinCode: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive']
    },
    roleId: {
        type: Schema.Types.ObjectId,
        ref: "user_role"
    },
    otp: {
        type: String
    },
    deleteAt: {
        type: Date
    },
    expireIn: {
        type: Number
    },
    token: {
        type: String
    }
},
    {
        timestamps: true
    }
);

// password convert for hash
userModel.pre("save",async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next()
})

module.exports = new model("user",userModel);