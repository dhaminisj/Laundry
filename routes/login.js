const express = require("express");
const router = express.Router();
const {
  sendOtpMail,
  sendOtpPhone,
  verifyOtpMail,
  verifyOtpPhone,
} = require("../otp");

router.route("/sendOtpMail").post(sendOtpMail);
router.route("/sendOtpPhone").post(sendOtpPhone);
router.route("/verifyOtpPhone").post(verifyOtpPhone);
router.route("/verifyOtpMail").post(verifyOtpMail);

module.exports = router;
