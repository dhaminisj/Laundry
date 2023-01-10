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
      const list = await laundryList.find({
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
module.exports = { addLaundryList, getLaundryList };
