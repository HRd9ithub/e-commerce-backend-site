const { default: mongoose } = require("mongoose");
const subCategoryModel = require("../models/subCategoryModel");


// create 
const createSubCategory = async(req,res) => {
    try {
        const record = await subCategoryModel.find({categoryId: new mongoose.Types.ObjectId(req.body.categoryId)})

        if(record){
           const filterData = record.find((val) => {
                return val.name.toLowerCase() === req.body.name
            })
            if(filterData){
                return res.status(400).json({message: "Sub-category already exists.", success: false});
            }
        }
        await subCategoryModel.create(req.body);

        return res.status(201).json({message: "Data added successfully.", success: true});
    } catch (error) {
        return res.status(500).json({message : error.message || "Interner server error.", success: false})
    }
}

// update 
const updateSubCategory = async(req,res) => {
    try {
        const { id } = req.params;
        const record = await subCategoryModel.find({categoryId: new mongoose.Types.ObjectId(req.body.categoryId),_id: {$ne: id}})
        console.log(record)

        if(record){
           const filterData = record.find((val) => {
                return val.name.toLowerCase() === req.body.name
            })
            if(filterData){
                return res.status(400).json({message: "Sub-category already exists.", success: false});
            }
        }

        const subcategoryData = await subCategoryModel.findByIdAndUpdate({_id: id},{$set: req.body })

        if(subcategoryData){
            return res.status(200).json({message: "Data updated successfully.", success: true});
        }else{
            return res.status(404).json({message: "Record not found.", success: false});
        }

    } catch (error) {
        return res.status(500).json({message : error.message || "Interner server error.", success: false})
    }
}

// get 
const getSubCategories = async(req,res) => {
    try {
        const subCategoriesData = await subCategoryModel.aggregate([
            {
                $match: {
                    deleteAt: {$exists : false}
                }
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: false
                }
            }
        ])

        return res.status(200).json({message: "Data fetch successfully.", success: true, data: subCategoriesData || []});

    } catch (error) {
        return res.status(500).json({message : error.message || "Interner server error.", success: false})
    }
}

// single get sub Category 
const singleGetSubCategory = async(req,res) => {
    try {
        const { id } = req.params;

        const subCategoriesData = await subCategoryModel.findOne({_id: id, deleteAt: {$exists : false}});

        return res.status(200).json({message: "Data fetch successfully.", success: true, data: subCategoriesData || {}});

    } catch (error) {
        return res.status(500).json({message : error.message || "Interner server error.", success: false})
    }
}

// delete Category 
const deleteSubCategory = async(req,res) => {
    try {
        const { id } = req.params;

        const subCategoriesData = await subCategoryModel.findByIdAndUpdate({_id: id},{$set: {deleteAt: new Date()} })

        if(subCategoriesData){
            return res.status(200).json({message: "Data deleted successfully.", success: true});
        }else{
            return res.status(404).json({message: "Record not found.", success: false});
        }

    } catch (error) {
        return res.status(500).json({message : error.message || "Interner server error.", success: false})
    }
}

module.exports = {
    createSubCategory,
    updateSubCategory,
    getSubCategories,
    singleGetSubCategory,
    deleteSubCategory
}