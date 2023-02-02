const express = require("express");
const { verify } = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const deliveryController = require("../controller/deliveryController");
const { Router } = require("express");

router
  .route("/delivery")
  .post(deliveryController.delivery);

module.exports = router;
