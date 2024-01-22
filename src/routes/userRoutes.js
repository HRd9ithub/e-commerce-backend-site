const express = require("express");
const { createUser } = require("../controllers/userControllers");
const { userValidation } = require("../utils/validation");

const route = express.Router();

route.use(userValidation);

// get route
route.get("/",() => {
    console.log("get");
});

// post route
route.post("/",createUser);

module.exports = route;