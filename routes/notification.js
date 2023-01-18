const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const notificationController = require("../controller/notificationConroller");
const { getNotifications } = require("../controller/notificationConroller");

router.route("/add-notification").post(notificationController.addNotifications);
router.route("/get-notification").post(verifyJWT, getNotifications);
module.exports = router;
