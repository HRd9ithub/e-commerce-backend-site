const moment = require("moment");
const couponModel = require("../models/couponModel");


// add funcation
const addCouponCode = async (req, res) => {
    try {
        const { code, percentage, activation_date, expired_date } = req.body;

        const couponData = await couponModel({
            code, percentage, activation_date, expired_date
        });

        await couponData.save();

        return res.status(201).json({ message: "Data added successfully.", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false });
    }
}

// update funcation
const updateCouponCode = async (req, res) => {
    try {
        const { code, percentage, activation_date, expired_date } = req.body;
        const { id } = req.params;

        const updateData = await couponModel.findByIdAndUpdate({ _id: id }, {
            code, percentage, activation_date, expired_date
        }, {
            new: true
        })

        return res.status(200).json({ message: "Data updated successfully.", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false });
    }
}

// get funcation
const getCouponCode = async (req, res) => {
    try {
        const couponCodeResult = await couponModel.find({ deleteAt: { $exists: false } });
        return res.status(200).json({ message: "Data fetched successfully", success: true, data: couponCodeResult });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false });
    }
}

// delete funcation
const deleteCouponCode = async (req, res) => {
    try {
        const { id } = req.params;

        const couponCodeResult = await couponModel.findByIdAndUpdate({ _id: id },{$set: {deleteAt: new Date()}});
        return res.status(200).json({ message: "Data deleted successfully", success: true });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false });
    }
}

// check coupon code
const checkCouponCode = async (req, res) => {
    try {
        const { code } = req.body;

        const couponCodeResult = await couponModel.findOne({
            code, $and: [
                { activation_date: { $lte: moment(new Date()).format("YYYY-MM-DD") } },
                { expired_date: { $gte: moment(new Date()).format("YYYY-MM-DD") } }
            ]
        });
        return res.status(200).json({ message: "Data fetched successfully", success: true, couponCodeResult });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false });
    }
}

module.exports = {
    getCouponCode, addCouponCode, updateCouponCode, deleteCouponCode, checkCouponCode
}