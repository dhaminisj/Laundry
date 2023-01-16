const express = require("express");
const { verify } = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const cartController = require("../controller/cartController");
const { Router } = require("express");

router.route("/add-to-cart").post(verifyJWT, cartController.addItemToCart);

module.exports = router;
