const express = require("express");
const { verify } = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const {
  addSubscriptionList,
  getSubscriptionList,
  buySubscription,
  viewSubscription,
  editSubscription,
  viewPickupDetails,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  endDate,
} = require("../controller/subscriptionController");

router.route("/addSubscriptionList").post(addSubscriptionList);
router.route("/getSubscriptionList").get(getSubscriptionList);
router.route("/buySubscription").post(verifyJWT, buySubscription);
router.route("/viewSubscription").post(verifyJWT, viewSubscription);
router.route("/editSubscription").post(verifyJWT, editSubscription);
router.route("/viewPickupDetails").post(verifyJWT, viewPickupDetails);
router.route("/cancelSubscription").post(verifyJWT, cancelSubscription);
router.route("/pauseSubscription").post(verifyJWT, pauseSubscription);
router.route("/resumeSubscription").post(verifyJWT, resumeSubscription);
router.route("/calculateEndDate").post(verifyJWT, endDate);
module.exports = router;
