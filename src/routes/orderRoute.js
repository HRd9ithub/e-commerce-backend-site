const { Router } = require("express");
const { paymentInitgation, updateOrder, getOrderList, getSingleOrderList, downloadReceipt } = require("../controllers/orderController");
const Auth = require("../middlewares/authentication");

const route = Router();

route.use(Auth);
// route.get("/file", downloadReceipt);

route.post('/create-checkout-session', paymentInitgation);

route.put("/:id", updateOrder);

route.get("/", getOrderList);

route.get("/:id", getSingleOrderList);


module.exports = route;