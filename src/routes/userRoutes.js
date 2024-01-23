const express = require("express");
const { createUser, singleUserGet, getUsers, deleteUser, updateUser } = require("../controllers/userControllers");
const { userValidation, userUpdateValidation } = require("../utils/validation");
const { errorHandler } = require("../middlewares/errorMiddleware");
const upload = require("../utils/multer");

const route = express.Router();

// post route
route.post("/", userValidation, errorHandler, createUser);

// single get route
route.get("/:id", singleUserGet);

// get route
route.get("/", getUsers);

// delete route
route.delete("/:id", deleteUser);

// update route
route.put("/:id", upload.single("profileImage"), userUpdateValidation, errorHandler, updateUser);

module.exports = route;