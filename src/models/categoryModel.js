const { Schema, model } = require("mongoose");


const categoryModel = new Schema({
    name: {
        type: String,
        require: true
    },
    deleteAt: {
        type: Date
    }
},
    {
        timestamps: true
    }
)

module.exports = new model("category", categoryModel);