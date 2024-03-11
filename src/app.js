const express = require("express");
const cors = require('cors');
const path = require('path');
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const productRoute = require("./routes/productRoute");
const couponRoute = require("./routes/couponRoute");
const orderRoute = require("./routes/orderRoute");
const dashboardRoute = require("./routes/dashboardRoute");
const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "../public")))

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/sub-category", subCategoryRoute);
app.use("/api/product", productRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);
app.use("/api/dashboard", dashboardRoute);

module.exports = app;