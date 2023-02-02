const { mongoose } = require("mongoose");
const { User } = require("../models");
const Delivery = require("../models/deliverySchema");
const { aggregate } = require("../models/orderSchema");
const Order = require("../models/orderSchema");

const delivery = async (req, res) => {
  try {
    const { type, orderId } = req.body;
    const details = await Order.findOne({ orderId: orderId }).populate(
      "userId",
      "name"
    );
    const data = new Delivery({
      type,
      orderId,
      name: details.userId.name,
      noOfItems: details.noOfItems,
      totalAmount: details.totalAmount,
      deliveryAddress: details.deliveryAddress,
    });
    const result = await data.save();

    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Delivery lists added",
        // result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not add delivery ",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const getDeliveryLists = async (req, res) => {
  try {
    const result = await Delivery.find({});
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Delivery lists fetched",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not fetch delivery list ",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const getParticularOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const result = await Order.findOne({ orderId });

    const data = await result.aggregate([
      {
        $group: {
          _id: { category: "$category" },
          count: { $sum: 1 },
        },
      },
    ]);
    console.log(data);
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "order details fetched",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not fetch order details ",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};
module.exports = { delivery, getDeliveryLists, getParticularOrder };
