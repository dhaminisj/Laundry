const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const upload = require("../utils/multer");
const promoController = require("../controller/promoController");

router
  .route("/add-promo-code")
  .post(upload.single("image"), promoController.addPromoCode);
router.route("/get-promo-code").post(verifyJWT, promoController.getPromoCode);
router.route("/add-burger-promo").post(promoController.burgerPromoCode);
router.route("/add-offers").post(promoController.addOffers);
router.route("/get-offers").post(promoController.getBurgerPromo);

module.exports = router;
