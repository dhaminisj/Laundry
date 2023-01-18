const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const {viewBalance,addMoneyToWallet} = require("../controller/walletControl")

router.route("/viewBalance").get(verifyJWT,viewBalance)
router.route("/addMoney").post(verifyJWT,addMoneyToWallet)

module.exports = router
