const transaction = require("../models/transactionSchema");
const users = require("../models/UserSchema");

const viewBalance = async (req, res) => {
  try {
    const [walletBalance] = await users
      .find({ _id: req.users.userId })
      .select(["-_id", "wallet"]);
    console.log(walletBalance);
    res.status(200).send({
      message: "wallet balance is " + walletBalance.wallet,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const addMoneyToWallet = async (req, res) => {
  try {
    const [user] = await users
      .find({ _id: req.users.userId })
      .select(["-_id", "wallet"]);
    await transaction.create({
      userId: req.users.userId,
      totalPrice: req.body.amount,
      walletBalance: user.wallet + req.body.amount,
      transactionType: "AMOUNT ADDED TO WALLET",
      card: req.body.card,
    });
    await users.findOneAndUpdate(
      { _id: req.users.userId },
      { wallet: user.wallet + req.body.amount }
    );
    res.status(200).send({
      message: "Amount Added To Wallet",
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

module.exports = {
  viewBalance,
  addMoneyToWallet,
};
