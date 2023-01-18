const mongoose = require("mongoose");
const subscriptionList = require("../models/subscriptionList");
const subscription = require("../models/subscriptionSchema");
const transaction = require("../models/transactionSchema");
const users = require("../models/UserSchema");
const addSubscriptionList = async (req, res) => {
  try {
    await subscriptionList.create({
      amount: req.body.amount,
      months: req.body.months,
      numberOfPickups: req.body.numberOfPickups,
      features: req.body.features,
    });
    res.status(200).send({ statusCode: 200, message: "Added Successfully" });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const getSubscriptionList = async (req, res) => {
  try {
    const list = await subscriptionList.find({});
    res.status(200).send({ statusCode: 200, list: list });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const buySubscription = async (req, res) => {
  try {
    console.log("hi");
    const [sub] = await subscription.find({ userId: req.users.userId });
    const id = "#id" + Math.random().toString(10).slice(3);
    const [user] = await users.find({ _id: req.users.userId });
    if (!sub) {
      await subscription.create({
        userId: req.users.userId,
        orderId: id,
        pickupDays: req.body.pickupDays,
        numberOfPickups: req.body.numberOfPickups,
        subscription: req.body.subscription,
        address: req.body.address,
        card: req.body.card,
        isWallet: req.body.isWallet,
      });
      if (req.body.isWallet) {
        amount = user.wallet - req.body.subscription.amount;
        if (req.body.subscription.amount < user.wallet) {
          await transaction.create({
            userId: req.users.userId,
            orderId: id,
            totalPrice: req.body.subscription.amount,
            walletBalance: amount,
            transactionType: "PURCHASE",
          });
        } else {
          res
            .status(200)
            .send({ statusCode: 200, message: "Maintain sufficient balance" });
        }
        await users.findOneAndUpdate(
          { _id: req.users.userId },
          { wallet: amount }
        );
      }
      res.status(200).send({
        statusCode: 200,
        message: "subscription order completed",
        orderId: id,
      });
    } else {
      res
        .status(200)
        .send({ statusCode: 200, message: "subscription already purchased" });
    }
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const viewSubscription = async (req, res) => {
  try {
    const viewPlans = await subscription.find({ userId: req.users.userId });
    console.log(viewPlans);
    res.status(200).send({ statusCode: 200, viewPlans });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};
const editSubscription = async (req, res) => {
  try {
    await subscription.findOneAndUpdate(
      { $and: [{ userId: req.users.userId }, { orderId: req.body.orderId }] },
      {
        pickupDays: req.body.pickupDays,
      }
    );
    res.status(200).send({ statusCode: 200, message: "subscription edited" });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const viewPickupDetails = async (req, res) => {
  try {
    const details = await subscription
      .find({ userId: req.users.userId })
      .select(["pickupDays"]);
    res.status(200).send({ statusCode: 200, details: details });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const [sub] = await subscription
      .find({
        $and: [{ userId: req.users.userId }, { orderId: req.body.orderId }],
      })
      .select([
        "pickupDays",
        "subscription",
        "card",
        "-_id",
        "orderId",
        "isWallet",
      ]);
    const [user] = await users.find({ _id: req.users.userId });
    const day1 = sub.pickupDays.subscriptionEnd;
    const day2 = Date.now();
    const diffTime = Math.abs(day2 - day1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (sub.subscription.months === 12) {
      refund = 1.367 * diffDays;
    } else if (sub.subscription.months === 6) {
      refund = 2.2166 * diffDays;
    } else if (sub.subscription.months === 3) {
      refund = 3.32 * diffDays;
    } else {
      refund = 6.633 * diffDays;
    }
    if (!sub.isWallet) {
      await transaction.insertMany({
        userId: req.users.userId,
        orderId: sub.orderId,
        totalPrice: refund,
        walletBalance: user.wallet + refund,
        transactionType: "REFUND",
      });
    }
    await users.findOneAndUpdate(
      { _id: req.users.userId },
      { wallet: user.wallet + refund }
    );
    await subscription.findOneAndDelete({
      $and: [{ userId: req.users.userId }, { orderId: req.body.orderId }],
    });
    if (!sub.isWallet) {
      account = "wallet";
    } else {
      account = sub.card.cardType + "with card number" + sub.card.number;
    }
    res.status(200).send({
      statusCode: 200,
      message: "subscription canceled successfully",
      refund: "refund of amount " + refund + "to your " + account,
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const pauseSubscription = async (req, res) => {};

module.exports = {
  addSubscriptionList,
  getSubscriptionList,
  buySubscription,
  viewSubscription,
  editSubscription,
  viewPickupDetails,
  cancelSubscription,
};
