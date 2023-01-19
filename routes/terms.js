const express = require("express");
const router = express.Router();
const termsController = require("../controller/termsController")
const verifyJWT = require("../middleware/verifyJWT");
require("dotenv").config();
router.route("/addTerms").post(termsController.addGenericTerms);



module.exports = router;
