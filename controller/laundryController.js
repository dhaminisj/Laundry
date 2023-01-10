const mongoose = require("mongoose");
const laundryList = require("../models/laundryListSchema");

const addLaundryList = async (req, res) => {
  try {
    await laundryList.create({
      type: req.body.type,
      category: req.body.category,
      cloth: req.body.cloth,
      price: req.body.price,
    });
    res.status(200).send({ message: "laundry list added successfully" });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const getLaundry = async (req, res) => {
  try {
    const list = await laundryList.find({
      $and: [{ type: req.body.type }, { category: req.body.category }],
    });

    res.status(200).send({
      laundryList: list,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const getLaundryList = async (req, res) => {
  try {
    const list = await laundryList.aggregate([
      {
        $project: {
          __v: 0,
          _id: 0,
        },
      },
      {
        $group: {
          _id: { category: "$category", type: "$type" },
          docs: { $push: "$$ROOT" },

          //   ,cloth: {$push: "$cloth"}
          // ,price: {$push: "$price"}
          // ,addOn: {$push: "$addOn"},
          //   //   docs: { $first: "$$ROOT" },
        },
      },
      {
        $project: {
          'docs._id': 0,
         'docs.type': 0,
          'docs.category': 0,
          'docs.__v':0
        },
      },
    ]);
   
    res.status(200).send({
      laundryList: list,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};
module.exports = { addLaundryList, getLaundryList };
