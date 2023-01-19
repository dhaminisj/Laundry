const express = require("express");
const router = express.Router();
const termsController = require("../controller/termsController");
const verifyJWT = require("../middleware/verifyJWT");
require("dotenv").config();
router
  .route("/create-terms-condition")
  .post(termsController.createTermsAndCondition);

router.route("/add-genericterms").post(termsController.addGenericTerms);
router.route("/add-privacyPolicy").post(termsController.addPrivacyPolicy);
router.route("/add-privacyPolicy").post(termsController.getTermsAndCondition);



module.exports = router;
