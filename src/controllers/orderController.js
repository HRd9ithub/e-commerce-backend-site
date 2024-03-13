const { default: mongoose } = require('mongoose');
const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const path = require("path");
const fs = require("fs");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = process.env.RESET_PASSWORD_CLIENT_URL;

// stripe payment
const paymentInitgation = async (req, res) => {
    try {
        const { products, address: { fullName, email, mobileNumber, address, state, city, pinCode, country }, percentage, total, subTotal, disCount, coupon } = req.body;

        const innerItem = products.map((val) => {
            return (
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: val.name
                        },
                        unit_amount: val.price * 100,
                    },
                    quantity: val.quantity
                }
            )
        });

        // Create a coupon
        const genrateCoupon = await stripe.coupons.create({
            percent_off: percentage || 0.01, // Discount percentage (adjust as needed)
            duration: 'once', // Valid for a single use
            currency: 'inr', // Currency
        });

        const customer = await stripe.customers.create({
            name: fullName,
            email: email,
            address: {
                line1: address,
                postal_code: pinCode,
                city: city,
                state: state,
                country: 'US',
            }
        });
        let session = ""
        if (percentage) {
            session = await stripe.checkout.sessions.create({
                customer: customer.id,
                payment_method_types: ["card"],
                line_items: innerItem,
                mode: 'payment',
                success_url: `${YOUR_DOMAIN}/success`,
                cancel_url: `${YOUR_DOMAIN}/checkout`,
                discounts: [{ coupon: genrateCoupon.id }]
            });
        } else {
            session = await stripe.checkout.sessions.create({
                customer: customer.id,
                payment_method_types: ["card"],
                line_items: innerItem,
                mode: 'payment',
                success_url: `${YOUR_DOMAIN}/success`,
                cancel_url: `${YOUR_DOMAIN}/checkout`,
            });
        }
        const orderData = new orderModel({
            shipping: {
                fullName,
                email,
                mobileNumber,
                address,
                city,
                state,
                pinCode,
                country
            },
            total,
            subTotal,
            disCount,
            coupon,
            orderId: generateOrderId(8),
            userId: req.user._id,
            products
        });
        await orderData.save();

        return res.status(200).json({ url: session.url, id: orderData._id });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false })
    }
}

// add order 
const updateOrder = async (req, res) => {
    try {
        const updateOrder = await orderModel.findByIdAndUpdate({ _id: req.params.id }, { status: "Complete" });

        updateOrder.products?.forEach(async (item) => {
            const product = await productModel.findById({ _id: new mongoose.Types.ObjectId(item._id) });
            if (product.stock > 0) {
                product.stock -= item.quantity;
                product.stock = product.stock < 0 ? 0 : product.stock;
                await product.save();
            }
        })
        return res.status(200).json({ success: true, updateOrder });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Interner server error",
            success: false
        })
    }
}

// get order list
const getOrderList = async (req, res) => {
    try {
        const { _id, isAdmin } = req.user;
        let orderList = [];

        if (isAdmin) {
            orderList = await orderModel.find({});
        } else {
            orderList = await orderModel.find({ userId: _id });
        }

        return res.status(200).json({
            message: "Order fetch successfully.",
            success: true,
            data: orderList
        })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false });
    }
}

// single get order list
const getSingleOrderList = async (req, res) => {
    try {
        const orderData = await orderModel.findById({_id: req.params.id});

        return res.status(200).json({
            message: "Order fetch successfully.",
            success: true,
            data: orderData
        })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false });
    }
}

// download file
const downloadReceipt = async (req, res) => {
    try {
        const filepath = path.resolve(__dirname, "../../templates/views/orderReceipt.ejs");
        const file = fs.readFileSync(filepath).toString();
        // const orderData = await orderModel.findById({_id: req.params.id});

        return res.status(200).json({
            message: "Order fetch successfully.",
            success: true,
            file
        })

    } catch (error) {
        return res.status(500).json({ message: error.message || "Interner server error.", success: false });
    }
}

// order id generate
function generateOrderId(length) {
    var result = '';
    for (var i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

module.exports = {
    paymentInitgation,
    updateOrder,
    getOrderList,
    getSingleOrderList,
    downloadReceipt
}