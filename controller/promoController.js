const { mongoose } = require("mongoose");
const Promo = require("../models/promoSchema");

const addPromoCode = async (req, res) => {
  try {
    const { promoCode, description } = req.body;

    const data = new Promo({
      promoCode,
      description,
    });
    const result = await data.save();
    res
      .status(200)
      .json({ statusCode: 200, message: "Coupon added successfully", result });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const getPromoCode = async (req, res) => {
  try {
    const { userId } = req.users;
    const result = await Promo.find();
    res.status(200).json({
      statusCode: 200,
      message: "Coupon fetched successfully",
      result,
    });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

module.exports = { addPromoCode, getPromoCode };
