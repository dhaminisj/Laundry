const express = require("express");
const { verify } = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const orderController = require("../controller/orderController");
const { Router } = require("express");

router.route("/checkout").post(verifyJWT, orderController.checkoutOrder);

module.exports = router;
