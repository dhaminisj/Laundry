const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const upload = require("../utils/multer");
const helpAndSupportController = require("../controller/helpAndSupportController");

router
    .route("/customerSupport")
    .post(verifyJWT, upload.array("image",10),helpAndSupportController.customerSupport);
router
    .route("/addImages")
    .post(verifyJWT, upload.array("image",10), helpAndSupportController.addImages);
module.exports = router;
