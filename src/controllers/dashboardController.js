const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const userModel = require("../models/userModel");

const getSummary = async(req,res) => {
    try {
        const customerCount = await userModel.find({ deleteAt: { $exists: false }, isAdmin: false }).count();
        const productCount = await productModel.find({ deleteAt: { $exists: false }}).count();
        const orderCount = await orderModel.find({ status: "Complete"}).count();
        const averagePrice = await orderModel.aggregate([
            {
                $match: {
                    status: "Complete"
                }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$total" }
              }
            }
          ])

        const summary = {
            customerCount,
            productCount,
            orderCount,
            averagePrice: averagePrice.length !== 0 ? averagePrice[0].total : 0
        }

        return res.status(200).json({message: "Dashboard Route", success: true, summary});
    } catch (error) {
        return res.status(500).json({message: error.message || "Internet server error", success: false});
    }
}

module.exports = {
    getSummary
}