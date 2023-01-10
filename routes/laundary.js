const express = require("express");
const router = express.Router();

const {addLaundryList,getLaundryList}=require("../controller/laundryController")

router.route("/addLaundryList").post(addLaundryList)
router.route("/getLaundryList").post(getLaundryList)

module.exports = router