const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
require("dotenv").config();

const {
  addLaundryList,
  getLaundryList,
} = require("../controller/laundryController");

router.route("/addLaundryList").post(upload.single("image"), addLaundryList);
router.route("/getLaundryList").post(getLaundryList);

module.exports = router;
