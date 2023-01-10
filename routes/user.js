const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");

//const upload = require("../../multer");
router.route("/register").post(userController.register);


module.exports = router;
