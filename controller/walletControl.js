const transactionSchema = require("../models/transactionSchema");
const transaction = require("../models/transactionSchema");
const users = require("../models/UserSchema");

const viewBalance = async (req, res) => {
  try {
    const [walletBalance] = await users
      .find({ _id: req.users.userId })
      .select(["-_id", "wallet"]);

    res.status(200).send({
      statusCode: 200,
      walletBalance: walletBalance.wallet,
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const addMoneyToWallet = async (req, res) => {
  try {
    if (req.body.amount > 0) {
      const [user] = await users
        .find({ _id: req.users.userId })
        .select(["-_id", "wallet"]);
      await transaction.create({
        userId: req.users.userId,
        totalPrice: req.body.amount,
        walletBalance: user.wallet + req.body.amount,
        transactionType: "MONEY TO WALLET",
        transactionStatus: "CREDIT",
        orderTitle: "MONEY ADDED TO WALLET",
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
    } else {
      res.status(406).send({
        status: 406,
        message: "enter valid amount",
      });
    }
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const getWalletHistory = async (req, res) => {
  const { userId } = req.users;
  try {
    // const walletHistory = await transactionSchema
    //     .find({ userId: req.users.userId })
    //     .select("walletBalance totalPrice transactionType paidAt");
    // const paidAtHistrory = walletHistory.map((e) => {
    //     return e.paidAt;
    // });
    const walletHistory = await transactionSchema.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$paidAt" },
            year: { $year: "$paidAt" },
            paidAt: "$paidAt",
          },
          transactions: { $push: "$$ROOT" },
        },
      },
      { $sort: { month: -1, year: -1 } },
      {
        $project: {
          "transactions._id": 0,
          "transactions.userId": 0,
          "transactions.__v": 0,
        },
      },
    ]);

    res.status(200).send({
      status: true,
      statusCode: 200,
      data:
        // {
        // paidAtHistrory,
        // transactions: walletHistory,
        walletHistory,
      // },
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

module.exports = {
  viewBalance,
  addMoneyToWallet,
  getWalletHistory,
};
