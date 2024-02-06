const express = require("express");
const Auth = require("../middlewares/authentication");
const { categoryValidation } = require("../utils/validation");
const { errorHandler } = require("../middlewares/errorMiddleware");
const { createCategory, updateCategory, getCategorys, singleGetCategory, deleteCategory, filterCategory } = require("../controllers/categoryController");

const route = express.Router();

// create route
route.post("/",Auth, categoryValidation, errorHandler, createCategory);

// update route
route.put("/:id",Auth, categoryValidation, errorHandler, updateCategory);

// get route
route.get("/",Auth, getCategorys);

// category and sub category route
route.get("/category",Auth, filterCategory);

// single get route
route.get("/:id",Auth, singleGetCategory);

// delete route
route.delete("/:id",Auth, deleteCategory);


module.exports = route;