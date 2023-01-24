const express = require("express");
const router = express.Router();
const concernTextController = require("../controller/concernTextController");
const { getConcernText } = require("../controller/cartController");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/add-concern-text").post(concernTextController.addConcernText);
router
    .route("/get-concern-text")
    .get(verifyJWT, concernTextController.getConcernText);
module.exports = router;
