const express = require("express");
const Auth = require("../middlewares/authentication");
const { subCategoryValidation } = require("../utils/validation");
const { errorHandler } = require("../middlewares/errorMiddleware");
const { createSubCategory, updateSubCategory, getSubCategories, singleGetSubCategory, deleteSubCategory } = require("../controllers/subCategoryController");

const route = express.Router();

// create route
route.post("/",Auth, subCategoryValidation, errorHandler, createSubCategory);

// update route
route.put("/:id",Auth, subCategoryValidation, errorHandler, updateSubCategory);

// get route
route.get("/",Auth, getSubCategories);

// single get route
route.get("/:id",Auth, singleGetSubCategory);

// delete route
route.delete("/:id",Auth, deleteSubCategory);


module.exports = route;