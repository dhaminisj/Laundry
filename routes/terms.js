const express = require("express");
const router = express.Router();
const termsController = require("../controller/termsController");
const faqController = require("../controller/faqController");
const verifyJWT = require("../middleware/verifyJWT");
require("dotenv").config();
router
  .route("/create-terms-condition")
  .post(termsController.createTermsAndCondition);

router.route("/add-genericterms").post(termsController.addGenericTerms);
router.route("/add-privacyPolicy").post(termsController.addPrivacyPolicy);
router
  .route("/get-terms-and-condition")
  .post(termsController.getTermsAndCondition);

router.route("/create-Faq").post(faqController.createFaq);
router.route("/get-Faq").post(faqController.getFaq);
router.route("/addCancelReason").post(termsController.addCancelReason)
router.route("/getCancelReason").get(termsController.getCancelReason)
module.exports = router;
