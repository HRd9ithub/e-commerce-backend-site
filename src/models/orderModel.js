const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
    shipping: {
        type: {
            fullName: String,
            email: String,
            mobileNumber: String,
            address: String,
            city: String,
            state: String,
            pinCode: String,
            country: String
        },
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    disCount: {
        type: Number
    },
    coupon: {
        type: String
    },
    orderId: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    status: {
        type: String,
        default: "Incomplete"
    },
    products:{
        type: Array
    }
},
    { timestamps: true }
);


module.exports = mongoose.model("order", orderModel);