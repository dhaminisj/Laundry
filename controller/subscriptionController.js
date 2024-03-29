const mongoose = require("mongoose");
const subscriptionList = require("../models/subscriptionList");
const subscription = require("../models/subscriptionSchema");
const transaction = require("../models/transactionSchema");
const users = require("../models/UserSchema");
const cancel = require("../models/cancelSchema");
const addSubscriptionList = async (req, res) => {
  try {
    await subscriptionList.create({
      amount: req.body.amount,
      months: req.body.months,
      numberOfPickups: req.body.numberOfPickups,
      features: req.body.features,
    });
    res.status(200).json({ statusCode: 200, message: "Added Successfully." });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const getSubscriptionList = async (req, res) => {
  try {
    const list = await subscriptionList.find({});
    res.status(200).json({
      statusCode: 200,
      message: "Subcription list fetched successfully.",
      list: list,
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const buySubscription = async (req, res) => {
  try {
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
        amount = 0;
        if (req.body.subscription.amount < user.wallet) {
          amount = parseInt(user.wallet) - req.body.subscription.amount;
          await transaction.create({
            userId: req.users.userId,
            orderId: id,
            totalPrice: req.body.subscription.amount,
            walletBalance: amount,
            transactionType: "PAYMENT",
            transactionStatus: "DEBIT",
            orderDescription: "New subscription purchased",
            orderTitle: "SUBSCRIPTION PURCHASED",
          });
        } else if (user.wallet > 0) {
          amount = 0;
          await transaction.create({
            userId: req.users.userId,
            orderId: id,
            totalPrice: user.wallet,
            walletBalance: 0,
            transactionType: "PAYMENT",
            transactionStatus: "DEBIT",
            orderDescription: "New subscription purchased",
            orderTitle: "SUBSCRIPTION PURCHASED",
          });
        } else {
          res
            .status(200)
            .send({ statusCode: 200, message: "Maintain sufficient balance" });
        }
        await users.findOneAndUpdate(
          { _id: req.users.userId },
          { wallet: amount, isSubscribed: true }
        );
      }
      res.status(200).send({
        statusCode: 200,
        message: "Subscription order completed.",
        orderId: id,
      });
    } else {
      const [user] = await users.find({ _id: req.users.userId });
      const day1 = sub.pickupDays.subscriptionEnd;
      const day2 = Date.now();
      const diffTime = Math.abs(day1 - day2);
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
      amount = parseInt(user.wallet);
      amount += refund;
      if (sub.isWallet) {
        await transaction.insertMany({
          userId: req.users.userId,
          orderId: req.body.orderId,
          transactionType: "REFUND",
          transactionStatus: "CREDIT",
          orderDescription: "Subscription cancelled refund",
          orderTitle: "SUBSCRIPTION CANCELLED",
          totalPrice: refund,
          walletBalance: amount,
        });
      }
      await users.findOneAndUpdate(
        { _id: req.users.userId },
        { wallet: amount }
      );
      await subscription.findOneAndDelete({ userId: req.users.userId });
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
        amount = 0;
        if (req.body.subscription.amount < user.wallet) {
          amount = parseInt(user.wallet) - req.body.subscription.amount;
          await transaction.create({
            userId: req.users.userId,
            orderId: id,
            totalPrice: req.body.subscription.amount,
            walletBalance: amount,
            transactionType: "PAYMENT",
            transactionStatus: "DEBIT",
            orderDescription: "New subscription purchased",
            orderTitle: "SUBSCRIPTION PURCHASED",
          });
        } else if (user.wallet > 0) {
          amount = 0;
          await transaction.create({
            userId: req.users.userId,
            orderId: id,
            totalPrice: user.wallet,
            walletBalance: 0,
            transactionType: "PAYMENT",
            transactionStatus: "DEBIT",
            orderDescription: "New subscription purchased",
            orderTitle: "SUBSCRIPTION PURCHASED",
          });
        } else {
          res.send({
            message: "Balance is zero",
          });
        }
      }
      await users.findOneAndUpdate(
        { _id: req.users.userId },
        { wallet: amount, isSubscribed: true }
      );
      res.status(200).send({
        statusCode: 200,
        message: "Plan modified successfully.",
        orderId: id,
      });
    }
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const endDate = async (req, res) => {
  try {
    stopDate = new Date();
    plan = req.body.plan * 31;
    stopDate = stopDate.setDate(stopDate.getDate(Date.now()) + plan);
    res.send({
      status: 200,
      subscriptionEnd: new Date(stopDate),
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const viewSubscription = async (req, res) => {
  try {
    const [viewPlans] = await subscription.find({ userId: req.users.userId });
    if (viewPlans) {
      if (
        new Date(Date.now()).toDateString() !==
        new Date(viewPlans.pickupDays.subscriptionEnd).toDateString()
      ) {
        if (
          viewPlans.isPaused == true &&
          new Date(viewPlans.ifPaused[0].to).toDateString() ==
            new Date(Date.now()).toDateString()
        ) {
          await subscription.findByIdAndUpdate(
            { userId: req.users.userId },
            {
              isPaused: false,
              ifPaused: {
                $pull: {
                  from: viewPlans.ifPaused[0].from,
                  to: viewPlans.ifPaused[0].to,
                },
              },
            }
          );
          const [view] = await subscription.find({ userId: req.users.userId });
          res.status(200).send({
            status: 200,
            view,
          });
        } else {
          res
            .status(200)
            .send({ statusCode: 200, message: "Successful", viewPlans });
        }
      } else {
        await subscription.findOneAndDelete({ userId: req.users.userId });
        await users.findOneAndUpdate(
          { _id: req.users.userId },
          { isSubscribed: false }
        );
        res.status(200).send({
          status: 200,
          message: "Subscription Expired.",
        });
      }
    } else {
      res.status(404).send({
        status: 404,
        message: "No subscription.",
      });
    }
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
    res.status(200).json({ statusCode: 200, message: "subscription edited." });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const viewPickupDetails = async (req, res) => {
  try {
    const details = await subscription
      .find({ userId: req.users.userId })
      .select(["pickupDays"]);
    res
      .status(200)
      .send({ statusCode: 200, message: "Successful", details: details });
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
    const diffTime = Math.abs(day1 - day2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (sub.subscription.months === 12) {
      refund = 1.367 * diffDays;
    } else if (sub.subscription.months === 6) {
      refund = 2.2166 * diffDays;
    } else if (sub.subscription.months === 3) {
      refund = 3.32 * diffDays;
    } else if (sub.subscription.months === 1) {
      refund = 6.633 * diffDays;
    }
    amount = parseInt(user.wallet);
    amount += refund;

    if (sub.isWallet) {
      await transaction.insertMany({
        userId: req.users.userId,
        orderId: req.body.orderId,
        transactionType: "REFUND",
        transactionStatus: "CREDIT",
        orderDescription: "Subscription cancelled refund",
        orderTitle: "SUBSCRIPTION CANCELLED",
        totalPrice: refund,
        walletBalance: amount,
      });
      await users.findOneAndUpdate(
        { _id: req.users.userId },
        { wallet: amount, isSubscribed: false }
      );
    } else {
      await users.findOneAndUpdate(
        { _id: req.users.userId },
        { isSubscribed: false }
      );
    }

    await subscription.findOneAndDelete({
      $and: [{ userId: req.users.userId }, { orderId: req.body.orderId }],
    });
    if (sub.isWallet) {
      card = "wallet";
      cardNumber = " ";
    } else {
      card = sub.card.cardType;
      cardNumber = sub.card.number;
    }
    await cancel.create({
      userId: req.users.userId,
      orderId: req.body.orderId,
      reason: req.body.reason,
      comments: req.body.comments,
    });
    refundBy = new Date();
    refundBy = refundBy.setDate(refundBy.getDate(Date.now()) + 7);
    refundBy = new Date(refundBy);
    res.status(200).send({
      statusCode: 200,
      message: "Subscription cancelled successfully",
      amount: refund,
      card: cardNumber,
      type: card,
      refundBy: refundBy,
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const pauseSubscription = async (req, res) => {
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

    const day1 = new Date(req.body.ifPaused.from);
    const day2 = new Date(req.body.ifPaused.to);
    const diffTime = Math.abs(day1 - day2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    await subscription.findOneAndUpdate(
      { $and: [{ userId: req.users.userId }, { orderId: req.body.orderId }] },
      {
        isPaused: true,
        ifPaused: req.body.ifPaused,
        "pickupDays.subscriptionEnd": sub.pickupDays.subscriptionEnd.setDate(
          sub.pickupDays.subscriptionEnd.getDate() + diffDays
        ),
      }
    );
    res.status(200).send({
      statusCode: 200,
      message: "Subscription paused successfully.",
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

const resumeSubscription = async (req, res) => {
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
        "ifPaused",
      ]);

    const day1 = Date.now();
    const day2 = new Date(sub.ifPaused[0].to);
    const diffTime = Math.abs(day1 - day2);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (day1 > sub.ifPaused[0].from) {
      await subscription.findOneAndUpdate(
        {
          $and: [{ userId: req.users.userId }, { orderId: req.body.orderId }],
        },
        {
          isPaused: false,
          $pull: {
            ifPaused: { from: sub.ifPaused.from, to: sub.ifPaused.to },
          },
          "pickupDays.subscriptionEnd": sub.pickupDays.subscriptionEnd.setDate(
            sub.pickupDays.subscriptionEnd.getDate() - diffDays
          ),
        }
      );
      res.status(200).send({
        statusCode: 200,
        message: "Subscription resumed successfully.",
      });
    } else {
      await subscription.findOneAndUpdate(
        {
          $and: [{ userId: req.users.userId }, { orderId: req.body.orderId }],
        },
        {
          isPaused: false,
          $pull: {
            ifPaused: { from: sub.ifPaused.from, to: sub.ifPaused.to },
          },
        }
      );
      res.status(200).send({
        statusCode: 200,
        message: "Subscription resumed successfully.",
      });
    }
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }
};

module.exports = {
  addSubscriptionList,
  getSubscriptionList,
  buySubscription,
  viewSubscription,
  editSubscription,
  viewPickupDetails,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  endDate,
};
