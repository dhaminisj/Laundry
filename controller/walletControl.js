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
        transactionType: "ADD MONEY",
        transactionStatus: "CREDIT",
        orderDescription: "MONEY ADDED TO WALLET",
        orderTitle: "ADD MONEY",
        card: req.body.card,
      });
      await users.findOneAndUpdate(
        { _id: req.users.userId },
        { wallet: user.wallet + req.body.amount }
      );
      res.status(200).send({
        statusCode: 200,
        message: "Amount added to wallet.",
        walletBalance: user.wallet + req.body.amount,
      });
    } else {
      res.status(406).send({
        statusCode: 406,
        message: "Enter valid amount",
      });
    }
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
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
          },
          paidAt: { $first: "$paidAt" },
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

const applyFilterToWalletHistory = async (req, res) => {
  try {
    let transactions = await transactionSchema.find();
    const { userId } = req.users;
    const { filter } = req.query;
    const sortBy = req.body;
    const transactionType = req.body.transactionType;
    let currentDate = new Date();
    let lastMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      currentDate.getDate()
    );
    let threeMonthsAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 3,
      currentDate.getDate()
    );
    let sixMonthsAgo = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 6,
      currentDate.getDate()
    );
    console.log(sixMonthsAgo);
    if (filter === "1 month") {
      transactions = transactions.filter(
        (transactionSchema) => transactionSchema.date > lastMonth
      );
    }
    if (filter === "3 months") {
      transactions = transactions.filter(
        (transactionSchema) => transactionSchema.date > threeMonthsAgo
      );
    }
    if (filter === "6 months") {
      transactions = transactions.filter(
        (transactionSchema) => transactionSchema.date > sixMonthsAgo
      );
    }
    let x = {
      paidAt: -1,
    };

    if (sortBy.sortBy === "oldest") {
      x = {
        paidAt: 1,
      };
    }
    console.log(sortBy, x);
    const filterView = await transactionSchema.aggregate([
      {
        $match: {
          transactionType: {
            $regex: `${transactionType}`,
            $options: "i",
          },
          filter,
        },
      },
      {
        $sort: x,
      },
    ]);
    res.status(200).send({
      status: true,
      statusCode: 200,
      message: "Filtered data",
      filterView,
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};
module.exports = {
  viewBalance,
  addMoneyToWallet,
  getWalletHistory,
  applyFilterToWalletHistory,
};
