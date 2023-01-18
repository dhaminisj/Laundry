const express = require("express");
const router = express.Router();
// const verifyJWT = require("../middleware/verifyJWT");
const notificationController = require("../controller/notificationConroller");

router.route("/add-notification").post(notificationController.addNotifications);

module.exports = router;
