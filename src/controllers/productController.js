const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");

// create function
const createProduct = async (req, res) => {
    try {
        let images = [];
        // image add
        if (req.files?.image) {
            req.files?.image.forEach((val) => {
                images.push(`Images/${val.filename}`)
            });
            req.body.thumbnail = images[0];
            req.body.images = images;
        }

        const productData = new productModel(req.body);

        await productData.save();

        return res.status(201).json({ message: "Data added successfully.", success: true });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message?.replace("product validation failed: images: ", "") || "Interner server error." });
    }
}

// get function
const getProducts = async (req, res) => {
    try {
        const products = await productModel.aggregate([
            {
                $match: {
                    deleteAt: { $exists: false }
                }
            },
            {
                $lookup:
                {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            }
        ])
        return res.status(200).json({ message: "Data fetch successfully.", success: true, products });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Interner server error." });
    }
}

// single product function
const singleGetroduct = async (req, res) => {
    try {
        const product = await productModel.aggregate([
            {
                $match: {
                    _id: { $eq: new mongoose.Types.ObjectId(req.params.id) },
                    deleteAt: { $exists: false }
                }
            },
            {
                $lookup:
                {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategory"
                }
            }
        ])
        return res.status(200).json({ message: "Data fetch successfully.", success: true, product: product.length === 0 ? {} : product[0] });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Interner server error." });
    }
}

// update function
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let images = [];
        if (req.body.image) {
            if (typeof req.body.image === "object") {
                images.push(...req.body.image);
            } else {
                images.push(req.body.image);
            }
        }
        // image add
        if (req.files?.image) {
            req.files?.image.forEach((val) => {
                images.push(`Images/${val.filename}`)
            });
        }
        req.body.images = images;
        req.body.thumbnail = images[0];

        const product = await productModel.findByIdAndUpdate({ _id: id }, {
            $set: {
                name: req.body.name,
                price: req.body.price,
                salePrice: req.body.salePrice,
                description: req.body.description,
                categoryId: req.body.categoryId,
                stock: req.body.stock,
                thumbnail: req.body.thumbnail,
                images: req.body.images,
                colors: req.body.colors,
                status: req.body.status,
                subCategoryId: req.body.subCategoryId ? req.body.subCategoryId : [],
                sizes: req.body.sizes ? req.body.sizes : [],
            }
        });

        if (product) {
            return res.status(200).json({ message: "Data updated successfully.", success: true });
        } else {
            return res.status(404).json({ message: "Record not found.", success: false });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Interner server error." });
    }
}

// delete function
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await productModel.findByIdAndUpdate({ _id: id }, { $set: { deleteAt: new Date() } });

        if (product) {
            return res.status(200).json({ message: "Data deleted successfully.", success: true });
        } else {
            return res.status(404).json({ message: "Record not found.", success: false });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Interner server error." });
    }
}

// ------------------ client side funcation ------------------------
// get function
const getProductsLists = async (req, res) => {
    try {
        const featuredProducts = await productModel.aggregate([
            {
                $match: {
                    deleteAt: { $exists: false },
                    status: { $eq: "Active" }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: '$subCategoryId',
                    products: { $first: '$$ROOT' },
                }
            },
            {
                $limit: 10
            },
            {
                $project:{
                    _id: 0
                }
            }
        ])
        const newProducts = await productModel.aggregate([
            {
                $match: {
                    deleteAt: { $exists: false },
                    status: { $eq: "Active" }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 10
            }
        ])
        const products = await productModel.aggregate([
            {
                $match: {
                    deleteAt: { $exists: false },
                    status: { $eq: "Active" }
                }
            },
            {
                $lookup:
                {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup:
                {
                    from: "subcategories",
                    localField: "subCategoryId",
                    foreignField: "_id",
                    as: "subCategory"
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ])
        return res.status(200).json({ message: "Data fetch successfully.", success: true, newProducts, featuredProducts, products });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Interner server error." });
    }
}


module.exports = {
    createProduct,
    getProducts,
    singleGetroduct,
    updateProduct,
    deleteProduct,
    getProductsLists
}