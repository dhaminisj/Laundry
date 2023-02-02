const express = require("express");
const router = express.Router();
const {
  sendOtpMail,
  sendOtpPhoneLogin,
  verifyOtpMail,
  verifyOtpPhone,
  sendOtpPhoneRegister,
} = require("../otp");

router.route("/sendOtpMail").post(sendOtpMail);
router.route("/sendOtpPhoneRegister").post(sendOtpPhoneRegister);
router.route("/sendOtpPhoneLogin").post(sendOtpPhoneLogin);
router.route("/verifyOtpPhone").post(verifyOtpPhone);
router.route("/verifyOtpMail").post(verifyOtpMail);

module.exports = router;
