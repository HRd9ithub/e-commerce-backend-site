const express = require("express");
const cors = require('cors');
const userRoute = require("./routes/userRoutes");
const app = express();

app.use(cors({
    "origin": process.env.RESET_PASSWORD_URL,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

app.use(express.json());

app.use("/api/user", userRoute);

module.exports = app;