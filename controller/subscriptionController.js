const mongoose = require("mongoose");
const subscriptionList = require("../models/subscriptionList");
const subscription = require("../models/subscriptionSchema");

const addSubscriptionList = async (req, res) => {
  try {
    await subscriptionList.create({
      amount: req.body.amount,
      months: req.body.months,
      numberOfPickups: req.body.numberOfPickups,
      features: req.body.features,
    });
    res.status(200).send({
      message: "Added Successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const getSubscriptionList = async (req, res) => {
  try {
    const list = await subscriptionList.find({});
    res.status(200).send({
      list: list,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const buySubscription = async (req, res) => {
  try {
    await subscription.create({
      userId: req.users.userId,
      pickupDays: req.body.pickupDays,
      amount: req.body.amount,
      months: req.body.months,
      numberOfPickups: req.body.numberOfPickups,
      subscriptionStart: req.body.subscriptionStart,
      subscriptionEnd: req.body.subscriptionEnd,
      deliveryType: req.body.deliveryType,
      deliverySlot: req.body.deliverySlot,
      address: req.body.address,
      card:req.body.card
    });
    res.status(200).send({
      message: "subscription order completed",
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const viewSubscription = async (req, res) => {
  try {
    const viewPlans = await subscription.findOne({ userId: req.users.userId });
    console.log(viewPlans);
    res.status(200).send({
      viewPlans,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

module.exports = {
  addSubscriptionList,
  getSubscriptionList,
  buySubscription,
  viewSubscription,
};
