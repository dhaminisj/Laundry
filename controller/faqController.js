const { User, FAQ } = require("../models/index");
const { mongoose } = require("mongoose");
const faqModel = require("../models/faqSchema");
require("dotenv").config();

const createFaq = async (req, res) => {
  try {
    const {
      ordersAndPayment,
      offersAndDiscount,
      cashbacks,
      availableServices,
      pickUpandDelivery,
      covidProtocols,
      subscription,
      returnAndReprocessing,
      addressManagement,
    } = req.body;

    const faq = new FAQ({
      ordersAndPayment,
      offersAndDiscount,
      cashbacks,
      availableServices,
      pickUpandDelivery,
      covidProtocols,
      subscription,
      returnAndReprocessing,
      addressManagement,
    });
    const result = await faq.save();
    if (result)
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Created FAQ successfully",
        data: result,
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Could not add FAQ",
    });
  } catch (error) {
    console.log("error from addFAQ", error);
  }
};
const getFaq = async (req, res) => {
  try {
    const faq = await FAQ.find({}, { _id: 0, __v: 0 }).lean();

    if (faq)
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "FAQ fetched successfully",
        data: faq,
      });
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Couldn't fetch FAQ",
    });
  } catch (error) {}
};
module.exports = { createFaq, getFaq };
