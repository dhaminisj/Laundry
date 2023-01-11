const express = require("express");
const router = express.Router();
const {
    addSubscriptionList,
    getSubscriptionList
} = require("../controller/subscriptionController")

router.route("/addSubscriptionList").post(addSubscriptionList)
router.route("/getSubscriptionList").get(getSubscriptionList)

module.exports = router