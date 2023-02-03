const { mongoose } = require("mongoose");
const { User } = require("../models");
const Delivery = require("../models/deliverySchema");
const { aggregate } = require("../models/orderSchema");
const Order = require("../models/orderSchema");
const Summary = require("../models/summarySchema");

const delivery = async (req, res) => {
  try {
    const { type, orderId, slot } = req.body;
    const details = await Order.findOne({ orderId: orderId }).populate(
      "userId",
      "name phone"
    );
    const data = new Delivery({
      type,
      orderId,
      slot,
      name: details.userId.name,
      phone: details.userId.phone,
      noOfItems: details.noOfItems,
      totalAmount: details.totalAmount,
      deliveryAddress: details.deliveryAddress,
      isCompleted: details.isCompleted,
      discount: details.discount,
      deliveryCharge: details.deliveryCharge,
      tax: details.tax,
      basketTotal: details.basketTotal,
      orders: details.orders,
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
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const getDeliveryLists = async (req, res) => {
  try {
    const { slot } = req.body;
    let result;
    if (slot == "morning") {
      result = await Delivery.find({ slot: "morning" }).select(
        "type name address noOfItems totalAmount phone isSubscribed"
      );
    } else {
      result = await Delivery.find({ slot: "evening" }).select(
        "type name address noOfItems totalAmount phone isSubscribed"
      );
    }
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
    const result = await Delivery.find({ orderId });

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

const addSummaryDetails = async (req, res) => {
  try {
    const {
      status,
      date,
      slot,
      deliveryOrders,
      deliveryBags,
      pickup,
      pickupBags,
      totalCashCollected,
      totalOrders,
    } = req.body;

    const data = new Summary({
      status,
      date,
      slot,
      deliveryOrders,
      deliveryBags,
      pickup,
      pickupBags,
      totalCashCollected,
      totalOrders,
    });
    const result = await data.save();
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Summary added",
        // result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not add summary ",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const getSummary = async (req, res) => {
  try {
    const result = await Summary.find({});
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Summary fetched",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not fetch summary ",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};
module.exports = {
  delivery,
  getDeliveryLists,
  getParticularOrder,
  addSummaryDetails,
  getSummary,
};
