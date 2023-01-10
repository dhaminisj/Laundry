const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");

const {
  addLaundryList,
  getLaundryList,
} = require("../controller/laundryController");

router.route("/addLaundryList").post(upload.single(image), addLaundryList);
router.route("/getLaundryList").post(getLaundryList);

module.exports = router;
