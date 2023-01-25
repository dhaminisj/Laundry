const mongoose = require("mongoose");
const laundryList = require("../models/laundryListSchema");
const cloudinary = require("../utils/cloudinaryConfig");
const addLaundryList = async (req, res) => {
  try {
    uploadFiles = req.file.path;
    const upload = await cloudinary.uploader.upload(uploadFiles, {
      folder: "profile-Image",
      use_filename: true,
    });
    await laundryList.create({
      type: req.body.type,
      category: req.body.category,
      cloth: req.body.cloth,
      price: req.body.price,
      image: upload.url,
    });
    res
      .status(200)
      .send({ statusCode: 200, message: "laundry list added successfully" });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const getLaundry = async (req, res) => {
  try {
    const list = await laundryList.find({
      $and: [{ type: req.body.type }, { category: req.body.category }],
    });

    res.status(200).send({ statusCode: 200, laundryList: list });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error });
  }
};

const getLaundryList = async (req, res) => {
  try {
    const list = await laundryList.aggregate([
      {
        $project: {
          __v: 0,
        },
      },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          docs: { $: "$$ROOT" },

          //   ,cloth: {$push: "$cloth"}
          // ,price: {$push: "$price"}
          // ,addOn: {$push: "$addOn"},
          //   //   docs: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          // "docs._id": 0,
          "docs.hangerUrl": 0,
          "docs.multiPackUrl": 0,
          "docs.noStarchUrl": 0,
          "docs.singlePackUrl": 0,
          "docs.starchUrl": 0,
          "docs.hangerDescription": 0,
          "docs.multiPackDescription": 0,
          "docs.noStarchDescription": 0,
          "docs.singlePackDescription": 0,
          "docs.starchDescription": 0,
          "docs.type": 0,
          "docs.category": 0,
          "docs.__v": 0,
        },
      },
    ]);

    res.status(200).send({ statusCode: 200, laundryList: list });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const getAddOnsUrl = async (req, res) => {
  try {
    const result = await laundryList
      .findOne()
      .select(
        "hangerUrl multiPackUrl noStarchUrl singlePackUrl starchUrl -_id"
      );
    res.status(200).json({ statusCode: 200, result });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};

const getDescription = async (req, res) => {
  try {
    const result = await laundryList
      .findOne()
      .select(
        "hangerDescription multiPackDescription noStarchDescription singlePackDescription starchDescription -_id"
      );
    res.status(200).json({ statusCode: 200, result });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
};
module.exports = {
  addLaundryList,
  getLaundryList,
  getAddOnsUrl,
  getDescription,
};
