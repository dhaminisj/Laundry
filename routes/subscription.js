const express = require("express");
const { verify } = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const {
  addSubscriptionList,
  getSubscriptionList,
  buySubscription,
  viewSubscription,
} = require("../controller/subscriptionController");

router.route("/addSubscriptionList").post(addSubscriptionList);
router.route("/getSubscriptionList").get(getSubscriptionList);
router.route("/buySubscription").post(verifyJWT, buySubscription);
router.route("/viewSubscription").post(verifyJWT, viewSubscription);

module.exports = router;
