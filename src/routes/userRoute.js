const express = require("express");
const { createUser, singleUserGet, getUsers, deleteUser, updateUser, statusUpdate, changePassword, changeImage } = require("../controllers/userController");
const { userValidation, userUpdateValidation, statusValidation, passwordValidation } = require("../utils/validation");
const { errorHandler } = require("../middlewares/errorMiddleware");
const Auth = require("../middlewares/authentication");

const route = express.Router();

route.post("/image",Auth, changeImage)

// post route
route.post("/", userValidation, errorHandler, createUser);

// single get route
route.get("/:id", Auth, singleUserGet);

// get route
route.get("/", Auth, getUsers);

// delete route
route.delete("/:id",Auth, deleteUser);

// update route
route.put("/:id",Auth, userUpdateValidation, errorHandler, updateUser);

// status change route
route.patch("/:id",Auth,statusValidation, errorHandler, statusUpdate);

// change password
route.post('/password', Auth,passwordValidation,errorHandler, changePassword);

module.exports = route;