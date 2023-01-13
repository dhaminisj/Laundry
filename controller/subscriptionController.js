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
    const id = "#id" + Math.random().toString(10).slice(3);
    await subscription.create({
      userId: req.users.userId,
      orderId: id,
      pickupDays: req.body.pickupDays,
      amount: req.body.amount,
      months: req.body.months,
      numberOfPickups: req.body.numberOfPickups,
      subscriptionStart: req.body.subscriptionStart,
      subscriptionEnd: req.body.subscriptionEnd,
      deliveryType: req.body.deliveryType,
      deliverySlot: req.body.deliverySlot,
      address: req.body.address,
      card: req.body.card,
    });
    res.status(200).send({
      message: "subscription order completed",
      orderId: id,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const viewSubscription = async (req, res) => {
  try {
    const viewPlans = await subscription.find({ userId: req.users.userId });
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
const editSubscription = async (req, res) => {
  try {
    await subscription.findOneAndUpdate(
      { $and: [{ userId: req.users.userId }, { _id: req.body._id }] },
      {
        pickupDays: req.body.pickupDays,
        deliverySlot: req.body.deliverySlot,
        deliveryType: req.body.deliveryType,
      }
    );
    res.status(200).send({
      message: "subscription edited",
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const viewPickupDetails = async (req, res) => {
  try {
    const details = await subscription
      .find({ userId: req.users.userId })
      .select(["pickupDays", "deliverySlot", "deliveryType", "-_id"]);
    res.status(200).send({
      details: details,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    await subscription.findOneAndDelete({
      $and: [{ userId: req.users.userId }, { orderId: req.body.orderId }],
    });
    res.status(200).send({
      message: "subscription canceled successfully",
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
  editSubscription,
  viewPickupDetails,
  cancelSubscription
};
