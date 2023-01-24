const Order = require("../models/orderSchema");
const User = require("../models/UserSchema");
const Laundry = require("../models/laundryListSchema");
const mongoose = require("mongoose");

const checkoutOrder = async (req, res) => {
  try {
    const { userId } = req.users;
    const list = req.body;

    neededList = list.map(function (docs) {
      return {
        laundryListId: docs.laundryListId,
        extras: docs.extras,
        packagingType: docs.packagingType,
      };
    });

    listOfLaundryListId = neededList
      .map((docs) => docs.laundryListId)
      .map(function (data) {
        return mongoose.Types.ObjectId(data);
      });

    let laundryDetails = await Laundry.aggregate([
      { $match: { _id: { $in: listOfLaundryListId } } },
      {
        $project: {
          price: 1,
          _id: 1,
          "Single Pack": 1,
          Hanger: 1,
          Multipack: 1,
          Starch: 1,
          "No Starch": 1,
        },
      },
    ]);

    let basketTotal = 0;
    for (let index1 in neededList) {
      for (let index2 in laundryDetails) {
        if (laundryDetails[index2]._id == neededList[index1]["laundryListId"]) {
          let extrasData = neededList[index1]["extras"];
          let priceOfExtras = laundryDetails[index2][extrasData];
          let packagingTypeData = neededList[index1]["packagingType"];
          let priceOfPackagingType = laundryDetails[index2][packagingTypeData];
          basketTotal +=
            laundryDetails[index2]["price"] +
            priceOfExtras +
            priceOfPackagingType;
        }
      }
    }

    const result = {
      userId,
      orderId: "#id" + Math.random().toString(10).slice(3),
      orders: list,
      basketTotal,
      tax: basketTotal * 0.3,
      noOfItems: list.length,
    };

    order = new Order(result);
    checkout = await order.save();

    if (checkout) {
      res.status(200).json({
        statusCode: 200,
        message: "Checkout Completed",
        data: checkout,
      });
    } else {
      res.status(400).json({
        statusCode: 400,
        message: "Unable to Checkout",
      });
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};
module.exports = { checkoutOrder };
