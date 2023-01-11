const express = require("express");
const router = express.Router();
const {
  addSubscriptionList,
  getSubscriptionList,
  buySubscription,
  viewSubscription,
} = require("../controller/subscriptionController");

router.route("/addSubscriptionList").post(addSubscriptionList);
router.route("/getSubscriptionList").get(getSubscriptionList);
router.route("/buySubscription").post(buySubscription);
router.route("/viewSubscription").post(viewSubscription);
module.exports = router;
