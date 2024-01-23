const express = require("express");
const { createUser, singleUserGet, getUsers, deleteUser, updateUser, statusUpdate, changePassword } = require("../controllers/userControllers");
const { userValidation, userUpdateValidation, statusValidation, passwordValidation } = require("../utils/validation");
const { errorHandler } = require("../middlewares/errorMiddleware");
const upload = require("../utils/multer");
const Auth = require("../middlewares/authentication");

const route = express.Router();

// post route
route.post("/", userValidation, errorHandler, createUser);

// single get route
route.get("/:id", Auth, singleUserGet);

// get route
route.get("/", Auth, getUsers);

// delete route
route.delete("/:id",Auth, deleteUser);

// update route
route.put("/:id",Auth, upload.single("profileImage"), userUpdateValidation, errorHandler, updateUser);

// status change route
route.patch("/:id",Auth,statusValidation, errorHandler, statusUpdate);

// change password
route.post('/password', Auth,passwordValidation,errorHandler, changePassword);

module.exports = route;