const express = require("express");
const Auth = require("../middlewares/authentication");
const upload = require("../utils/multer");
const { productValidation } = require("../utils/validation");
const { errorHandler } = require("../middlewares/errorMiddleware");
const { createProduct, getProducts, singleGetroduct, updateProduct, deleteProduct } = require("../controllers/productController");

const route = express.Router();


// create api route
route.post("/", Auth, upload.fields([
    { name: 'image' }
]), productValidation, errorHandler, createProduct);

// get api route
route.get("/", Auth, getProducts);

// get single api route
route.get("/:id", Auth, singleGetroduct);

// update api route
route.put("/:id", Auth, upload.fields([
    { name: 'image' }
]), productValidation, errorHandler, updateProduct);

// delete api route
route.delete("/:id", Auth, deleteProduct);

module.exports = route;
