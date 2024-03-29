const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const {
    viewBalance,
    addMoneyToWallet,
    getWalletHistory,
    applyFilterToWalletHistory,
} = require("../controller/walletControl");

router.route("/viewBalance").get(verifyJWT, viewBalance);
router.route("/addMoney").post(verifyJWT, addMoneyToWallet);
router.route("/getWalletHistory").get(verifyJWT, getWalletHistory);
router.route("/apply-filter").post(verifyJWT,applyFilterToWalletHistory)

module.exports = router;
