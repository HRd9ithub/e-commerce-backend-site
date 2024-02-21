const { Schema, model } = require("mongoose");

const productModel = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    salePrice: {
        type: Number,
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: Schema.ObjectId,
        require: true,
        ref: "categoryModel"
    },
    subCategoryId: {
        type: [Schema.ObjectId],
        ref: "subCategoryModel"
    },
    stock: {
        type: Number,
        required: true
    },
    thumbnail :{
        type: String,
        required: true
    },
    images: {
        type: [String], // Assuming the images are stored as strings (file paths or URLs)
        validate: {
            validator: function (images) {
                return images.length >= 1 && images.length <= 5;
            },
            message: 'A minimum of 1 and a maximum of 5 images are required.'
        }
    },
    sizes: {
        type: [String]
    },
    colors: {
        type: [String]
    },
    status: {
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

module.exports = new model("product", productModel);