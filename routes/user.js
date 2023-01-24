const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const ratingController = require("../controller/ratingController");
const refreshController = require("../controller/refreshController")
const upload = require("../utils/multer");
const checkUserLoggedIn = require("../middleware/checkUserIsLoggedIn");
const verifyJWT = require("../middleware/verifyJWT");

//const upload = require("../../multer");
require("dotenv").config();
router.route("/register").post(userController.register);
router
  .route("/login")
  .post(userController.login)
  .delete(verifyJWT, userController.logout);
router
  .route("/updateProfilePic")
  .post(upload.single("image"), verifyJWT, userController.updateUserProfilePic)
  .get(verifyJWT, userController.getProfile);
router.route("/edit-profile").post(verifyJWT, userController.editProfile);

router.route("/handle-refresh").get(refreshController.handleRefreshToken)

router.route("/add-address").post(verifyJWT, userController.addAddress);
router
  .route("/update-address")
  .post(verifyJWT, userController.getAddress)
  .put(verifyJWT, userController.updateAddress)
  .delete(verifyJWT, userController.deleteAddress);

router.route("/addRating").put(verifyJWT, ratingController.addRating);
module.exports = router;
