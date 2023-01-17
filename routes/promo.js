const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const promoController = require("../controller/promoController");

router.route("/add-promo-code").post(promoController.addPromoCode);
router.route("/get-promo-code").post(verifyJWT, promoController.getPromoCode);

module.exports = router;