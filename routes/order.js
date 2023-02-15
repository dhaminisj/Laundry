const express = require("express");
const { verify } = require("jsonwebtoken");
const verifyJWT = require("../middleware/verifyJWT");
const router = express.Router();
const orderController = require("../controller/orderController");
const upload = require("../utils/multer");

const { Router } = require("express");

router.route("/checkout").post(verifyJWT, orderController.checkoutOrder);

router.route("/place-order").post(verifyJWT, orderController.addressAndSlot);
router.route("/apply-promo").post(verifyJWT, orderController.applyPromo);
router.route("/payment").post(verifyJWT, orderController.payment);
router.route("/invoice").post(verifyJWT, orderController.invoice);
router
  .route("/getOrderHistory")
  .get(verifyJWT, orderController.getOrderHistory);
router.route("/empty-basket").delete(verifyJWT, orderController.emptyBasket);
router
  .route("/upload-images")
  .post(upload.array("image", 20), verifyJWT, orderController.uploadImages);

module.exports = router;
