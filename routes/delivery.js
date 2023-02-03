const express = require("express");
const { verify } = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const deliveryController = require("../controller/deliveryController");
const { Router } = require("express");

router
  .route("/delivery")
  .post(deliveryController.delivery)
  .get(deliveryController.getDeliveryLists);

router.route("/delivery-order").post(deliveryController.getParticularOrder);

router.route("/summary").post(deliveryController.addSummaryDetails);

router.route("/get-summary").post(deliveryController.getSummary);

module.exports = router;