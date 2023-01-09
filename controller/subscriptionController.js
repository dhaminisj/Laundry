const mongoose = require("mongoose");
const subscriptionList = require("../models/subscriptionList");

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

module.exports = { addSubscriptionList, getSubscriptionList };
