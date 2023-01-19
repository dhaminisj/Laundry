const { mongoose } = require("mongoose");
const Promo = require("../models/promoSchema");
const cloudinary = require("../utils/cloudinaryConfig");

const addPromoCode = async (req, res) => {
  try {
    const {
      bankCode,
      discountPercentage,
      discountUpto,
      onOrderAbove,
      title,
      description,
    } = req.body;

    const bankIcon = req.file.path; // image file

    const cloudinaryResult = await cloudinary.uploader.upload(bankIcon, {
      folder: "image",
    });
    const data = new Promo({
      bankCode,
      bankIcon: cloudinaryResult.url,
      discountPercentage,
      discountUpto,
      onOrderAbove,
      title,
      description,
    });

    const result = await data.save();
    res
      .status(200)
      .json({ statusCode: 200, message: "Coupon added successfully", result });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
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
