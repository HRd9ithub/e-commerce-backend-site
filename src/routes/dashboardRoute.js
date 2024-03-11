const express = require("express");
const Auth = require("../middlewares/authentication");
const { getSummary } = require("../controllers/dashboardController");

const route = express.Router();

// Authentication middleware use
route.use(Auth);

// get route
route.get("/", getSummary);



module.exports= route;