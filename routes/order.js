const express = require("express");
const { verify } = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const orderController = require("../controller/orderController");
const { Router } = require("express");

router.route("/checkout").post(verifyJWT, orderController.checkoutOrder);
router.route("/place-order").post(verifyJWT, orderController.addressAndSlot);
router.route("/apply-promo").post(verifyJWT, orderController.applyPromo);
router.route("/payment").post(verifyJWT, orderController.payment);

module.exports = router;
