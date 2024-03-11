const { Router } = require("express");
const { getCouponCode, addCouponCode, updateCouponCode, deleteCouponCode, checkCouponCode } = require("../controllers/couponController");
const { couponCodeValidation } = require("../utils/validation");
const { errorHandler } = require("../middlewares/errorMiddleware");
const { check } = require("express-validator");


const route = Router();

route.get("/", getCouponCode);

// add route
route.post("/",couponCodeValidation, errorHandler,  addCouponCode);

// update route
route.put("/:id",couponCodeValidation, errorHandler,  updateCouponCode);

// delete route
route.delete("/:id", deleteCouponCode);

// check coupon code route
route.post("/check",[check("code", "Code is a required field.").trim().notEmpty()], errorHandler, checkCouponCode)


module.exports = route;