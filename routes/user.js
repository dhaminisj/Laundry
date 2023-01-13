const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const upload = require("../utils/multer");
const checkUserLoggedIn = require("../middleware/checkUserIsLoggedIn");
const verifyJWT = require("../middleware/verifyJWT");

//const upload = require("../../multer");
require("dotenv").config();
router.route("/register").post(userController.register);
router
  .route("/updateProfilePic")
  .post(upload.single("image"), verifyJWT, userController.updateUserProfilePic)
  .get(verifyJWT, userController.getProfile);

router.route("/add-address").post(verifyJWT, userController.addAddress);
router
  .route("/update-address")
  .put(verifyJWT, userController.updateAddress)
  .delete(verifyJWT, userController.deleteAddress);

module.exports = router;
