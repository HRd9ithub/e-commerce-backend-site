const { Schema, model } = require("mongoose");


const couponModel = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        set: function(code) {
            // Define your custom setter logic here
            return code.toUpperCase(); 
        }
    },
    percentage: {
        type: String,
        required: true
    },
    activation_date: {
        type: Date,
        reqyired: true
    },
    expired_date: {
        type: Date
    },
    deleteAt: {
        type: Date
    }
},
    {
        timestamps: true
    }
)

module.exports = new model("couponCode", couponModel);