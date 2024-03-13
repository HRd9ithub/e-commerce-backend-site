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
const session = require("express-session");
const passport = require("passport");
const app = express();
require("./utils/passport");

app.use(cors({
    credentials: true,
    // origin: "http://localhost:3000"
    origin: function (origin, callback) {
        if (process.env.ACCESS_URL.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
}));

app.use(express.json());
app.use(session({
    secret: "Googleloginapp",
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

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