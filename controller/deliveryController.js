const { mongoose } = require("mongoose");
const DeliveryUser = require("../models/deliveryUserSchema");
const Delivery = require("../models/deliverySchema");
const { aggregate } = require("../models/orderSchema");
const Order = require("../models/orderSchema");
const Summary = require("../models/summarySchema");
const jwt = require("jsonwebtoken");

const deliveryRegister = async (req, res) => {
  if (!req.body)
    res
      .status(400)
      .json({ status: false, statusCode: 400, message: "Body not found." });
  const { name, phone } = req.body;

  const userfound = await DeliveryUser.findOne({ phone });
  if (userfound)
    return res.status(403).json({
      status: false,
      statusCode: 403,
      message: "User with this phone number already present.",
    });
  else
    try {
      const user = new DeliveryUser({
        name,
        phone,
      });
      const result = await user.save();
      if (result) {
        const accessToken = jwt.sign(
          { userId: result._id, phone: result.phone },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "60d" }
        );

        const refreshToken = jwt.sign(
          { userId: result._id, phone: result.phone },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "100d" }
        );
        await DeliveryUser.findOneAndUpdate(
          { _id: result._id },
          { refreshToken: refreshToken }
        );

        res.header("Refresh-Token", refreshToken);
        res.header("Authorization", "Bearer " + accessToken);
        res.status(200).json({
          statusCode: 200,
          message: "Delivery user succesfully registered.",
        });
      } else
        res.status(400).json({
          statusCode: 400,
          message: "Couldn't register.",
        });
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: error.message });
    }
};

const delivery = async (req, res) => {
  try {
    const { type, orderId, slot } = req.body;
    const details = await Order.findOne({ orderId: orderId }).populate(
      "userId",
      "name phone isSubscribed"
    );
    const data = new Delivery({
      type,
      orderId,
      slot,
      noOfItems: details.noOfItems,
      totalAmount: details.totalAmount,
      orderItems: {
        orders: details.orders,
        selected: details.selected,
        paymentDetails: {
          noOfItems: details.noOfItems,
          totalPayable: details.totalAmount,
          totalAmount: details.fromOtherSource,
          lmWallet: details.fromWallet,
          discount: details.discount,
          deliveryCharge: details.deliveryCharge,
          tax: details.tax,
          basketTotal: details.basketTotal,
        },
      },
      userDetails: {
        name: details.userId.name,
        phone: details.userId.phone,
        isSubscribed: details.userId.isSubscribed,
        deliveryAddress: details.deliveryAddress,
      },
      status: {
        isCompleted: details.isCompleted,
        paymentStatus: details.paymentStatus,
        returnStatus: details.returnStatus,
      },
    });
    const result = await data.save();

    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Delivery lists added.",
        // result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not add delivery.",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const getDeliveryLists = async (req, res) => {
  try {
    const result = await Delivery.find({});
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Delivery lists fetched.",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not fetch delivery list.",
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
        message: "Order details fetched.",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not fetch order details.",
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
      vanNumber,
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
      vanNumber,
    });
    const result = await data.save();
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Summary added.",
        // result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not add summary.",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const getSummary = async (req, res) => {
  try {
    const morning = await Summary.find({ slot: "8AM-12PM" });
    const evening = await Summary.find({ slot: "5PM-9PM" });

    res.status(200).json({
      statusCode: 200,
      message: "Summary fetched.",
      morning,
      evening,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};
module.exports = {
  deliveryRegister,
  delivery,
  getDeliveryLists,
  getParticularOrder,
  addSummaryDetails,
  getSummary,
};
