const { mongoose } = require("mongoose");
const Promo = require("../models/promoSchema");
const BurgerPromo = require("../models/burgerPromoSchema");
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
      .json({ statusCode: 200, message: "Coupon added successfully.", result });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const getPromoCode = async (req, res) => {
  try {
    const { userId } = req.users;
    const result = await Promo.find();
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Coupon fetched successfully.",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Unable to fetch Coupons.",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const burgerPromoCode = async (req, res) => {
  try {
    const { promoTitle, promoDescription, offers } = req.body;
    const data = new BurgerPromo({
      promoTitle,
      promoDescription,
      offers,
    });
    const result = await data.save();

    res
      .status(200)
      .json({ statusCode: 200, message: "Coupon added successfully.", result });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};
const addOffers = async (req, res) => {
  try {
    const { offerTitle, expireDate, promoCode } = req.body;
    const obj = {
      offerTitle,
      expireDate,
      promoCode,
    };
    const data = await BurgerPromo.findByIdAndUpdate(
      { _id: "63ce34bf84e80c98af906d79" },
      { $push: { offers: obj } },
      { new: true }
    );
    if (data)
      res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Added offers successfully.",
        data: data,
      });
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Could not add offers.",
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const getBurgerPromo = async (req, res) => {
  try {
    const result = await BurgerPromo.find();
    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "Promos fetched successfully.",
      result,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};
module.exports = {
  addPromoCode,
  getPromoCode,
  burgerPromoCode,
  addOffers,
  getBurgerPromo,
};
