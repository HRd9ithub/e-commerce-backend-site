const { Schema, model } = require("mongoose");

const productModel = new Schema({
    name: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    discountPrice: {
        type: Number,
    },
    description: {
        type: String,
        require: true
    },
    categoryId: {
        type: Schema.ObjectId,
        require: true,
        ref: "categoryModel"
    },
    subCategoryId: {
        type: Schema.ObjectId,
        ref: "subCategoryModel"
    },
    stock: {
        type: Number,
        require: true
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
    colors: {
        type: [String],
        default: ["#000000"]
    },
    sizes: {
        type: [String]
    },
    isActive: {
        type: Boolean,
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