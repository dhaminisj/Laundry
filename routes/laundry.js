const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
require("dotenv").config();

const {
  addLaundryList,
  getLaundryList,
  getAddOnsUrl,
} = require("../controller/laundryController");

router.route("/addLaundryList").post(upload.single("image"), addLaundryList);
router.route("/getLaundryList").post(getLaundryList);
router.route("/get-urls").post(getAddOnsUrl);

module.exports = router;
