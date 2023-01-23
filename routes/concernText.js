const express = require("express");
const router = express.Router();
const concernTextController = require("../controller/concernTextController");
const { getConcernText } = require("../controller/cartController");

router.route("/add-concern-text").post(concernTextController.addConcernText);
router.route("/get-concern-text").get(concernTextController.getConcernText);
module.exports = router;
