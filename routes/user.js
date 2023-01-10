const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const upload = require("../utils/multer");
const checkUserLoggedIn = require("../middleware/checkUserIsLoggedIn");

//const upload = require("../../multer");
require("dotenv").config();
router.route("/register").post(userController.register);
router
  .route("/updateProfilePic")
  .post(upload.single("image"), userController.updateUserProfilePic)
  .get(checkUserLoggedIn, userController.getProfile);
module.exports = router;
