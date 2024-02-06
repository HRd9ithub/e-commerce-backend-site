const { Schema, model } = require("mongoose");


const subCategoryModel = new Schema({
    categoryId: {
        type: Schema.ObjectId,
        ref: "categoryModel",
        require: true
    },
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

module.exports = new model("subCategory", subCategoryModel);