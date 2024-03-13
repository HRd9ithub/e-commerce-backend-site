const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = new Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    facebookId: {
        type: String
    },
    githubId: {
        type: String
    },
    mobileNumber: {
        type: Number
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
        type: String
    },
    city: {
        type: String,
    },
    pinCode: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default : "Active"
    },
    isAdmin: {
        type: Boolean,
        default: false
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
    forgotTokenExpireIn: {
        type: Number
    },
    forgotToken : {
        type: String
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

// password compare
userModel.methods.comparePassword = async function (password) {
    const isMatched = await bcrypt.compare(password, this.password);
    return isMatched;
}

// generate token
userModel.methods.generateToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id },process.env.SECRET_KEY);
        return token
    } catch (error) {
        console.log('error :>>>> ', error);
    }
}


module.exports = new model("user",userModel);