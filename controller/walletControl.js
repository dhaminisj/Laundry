const transaction = require("../models/transactionSchema");
const users = require("../models/UserSchema");

const viewBalance = async (req, res) => {
  try {
    const [walletBalance] = await users
      .find({ _id: req.users.userId })
      .select(["-_id", "wallet"]);

    res
      .status(200)
      .send({ statusCode: 200, walletBalance: walletBalance.wallet });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const addMoneyToWallet = async (req, res) => {
  try {
    if(req.body.amount > 0){
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
        statusCode: 200,
        message: "Amount Added To Wallet",
        walletBalance: user.wallet + req.body.amount,
      });
    }else{
        res.status(406).send({
            status:406,
            message:"enter valid amount"
        })
    }
 
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

module.exports = {
  viewBalance,
  addMoneyToWallet,
};
