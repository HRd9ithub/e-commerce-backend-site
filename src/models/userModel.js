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
        type: String
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
        enum: ['Active', 'Inactive'],
        default : "Active"
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