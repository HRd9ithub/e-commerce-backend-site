const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");

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
        req.body.subCategoryId = req.body.subCategoryId ? req.body.subCategoryId : []
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
                $sort: { _id: -1 }
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
                $project: {
                    _id: "$products._id",
                    name: "$products.name",
                    price: "$products.price",
                    salePrice: "$products.salePrice",
                    thumbnail: "$products.thumbnail",
                    createdAt: "$products.createdAt"
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
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    price: 1,
                    salePrice: 1,
                    thumbnail: 1,
                    createdAt: 1
                }
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

// getFilterValues
const getFilterValues = async (req, res) => {
    try {
        const maxPrice = await productModel.findOne({deleteAt: { $exists: false }},{price: 1}).sort({price: -1});
        const uniqueColors = await productModel.distinct("colors");
        const uniqueSizes = await productModel.distinct("sizes");

        const filterValue = {
            maxPrice: maxPrice.price || 0,
            uniqueColors,
            uniqueSizes
        }


        // const filterValue = await productModel.aggregate([
        //     {
        //         $unwind: "$colors"
        //     },
        //     {
        //         $unwind: "$sizes"
        //     },
        //     {
        //         $group: {
        //             _id: null,
        //             maxPrice: { $max: "$price" },
        //             uniqueColors: { $addToSet: "$colors" },
        //             uniqueSizes: { $addToSet: "$sizes" }
        //         }
        //     }
        // ]);

        const categoryData = await categoryModel.aggregate([
            {
                $match: {
                    deleteAt: { $exists: false }
                }
            },
            {
                $lookup:
                {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "categoryId",
                    pipeline: [
                        {
                            $match: {
                                "deleteAt": { $exists: false },
                            }
                        }
                    ],
                    as: "subCategory"
                }
            }
        ])

        return res.status(200).json({ message: "Filter fetch successfully.", success: true, filterValue, categoryData });

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
    getProductsLists,
    getFilterValues
}