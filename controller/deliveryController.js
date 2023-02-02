const { mongoose } = require("mongoose");
const Delivery = require("../models/deliverySchema");
const Order = require("../models/orderSchema");

const delivery = async (req, res) => {
  try {
    const { type, orderId } = req.body;
    const details = await Order.find({ orderId });
    console.log(details);
    // const data = new Delivery({
    //   type,
    //   orderId,
    // });
    // const result = await data.save();
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
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

module.exports = { delivery };
