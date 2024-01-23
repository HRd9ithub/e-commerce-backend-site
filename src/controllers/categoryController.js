const categoryModel = require("../models/categoryModel")


// create 
const createCategory = async (req, res) => {
    try {
        await categoryModel.create(req.body);

        return res.status(201).json({ message: "Data added successfully.", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false })
    }
}

// update Category 
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryData = await categoryModel.findByIdAndUpdate({ _id: id }, { $set: req.body })

        if (categoryData) {
            return res.status(200).json({ message: "Data updated successfully.", success: true });
        } else {
            return res.status(404).json({ message: "Record not found.", success: false });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false })
    }
}

// get Category 
const getCategorys = async (req, res) => {
    try {
        const categoryData = await categoryModel.find({ deleteAt: { $exists: false } });

        return res.status(200).json({ message: "Data fetch successfully.", success: true, data: categoryData || [] });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false })
    }
}

// single get Category 
const singleGetCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryData = await categoryModel.findOne({ _id: id, deleteAt: { $exists: false } });

        return res.status(200).json({ message: "Data fetch successfully.", success: true, data: categoryData || {} });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false })
    }
}

// delete Category 
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const categoryData = await categoryModel.findByIdAndUpdate({ _id: id }, { $set: { deleteAt: new Date() } })

        if (categoryData) {
            return res.status(200).json({ message: "Data deleted successfully.", success: true });
        } else {
            return res.status(404).json({ message: "Record not found.", success: false });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false })
    }
}

// filter Category 
const filterCategory = async (req, res) => {
    try {

        const categoryData = await categoryModel.aggregate([
            {
                $match :{
                    deleteAt: {$exists: false}
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

        return res.status(200).json({ message: "Data fetch successfully.", success: true, data: categoryData });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false })
    }
}

module.exports = {
    createCategory,
    updateCategory,
    getCategorys,
    singleGetCategory,
    deleteCategory,
    filterCategory
}