const Order = require("../models/orderSchema");
const User = require("../models/UserSchema");
const Laundry = require("../models/laundryListSchema");
const mongoose = require("mongoose");

const placeOrder = async (req, res) => {
  try {
    const { userId } = req.users;
    const list = req.body;
    console.log("list", list);
    neededList = list.map(function (docs) {
      return {
        laundryListId: docs.laundryListId,
        extras: docs.extras,
        packagingType: docs.packagingType,
      };
    });
    console.log("neededList", neededList);

    listOfLaundryListId = neededList
      .map((docs) => docs.laundryListId)
      .map(function (data) {
        return mongoose.Types.ObjectId(data);
      });
    console.log("listOfLaundryListId", listOfLaundryListId);

    // extras
    // packagingType

    // singlePack
    // hanger
    // multiplePack
    // starch
    // noStrach

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
    console.log("agg", laundryDetails);

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

    // const result = {
    //   userId,
    // orderId: "#id" + Math.random().toString(10).slice(3),
    //   orders: [
    //     {
    //       itemId,
    //       laundryListId,
    //       type,
    //       category,
    //       cloth,
    //       packagingType,
    //       extras,
    //       comments,
    //       price: laundryDetails.price,
    //     },
    //   ],
    // };
    // order = new Order(result);
    // data = await order.save();
    // console.log(data.orders.length);

    res.send({ basketTotal: basketTotal });
  } catch (error) {
    res.status(400).json({ statusCode: 400, message: error.message });
  }

  // try {
  //   const { userId } = req.users;
  //   const {
  //     itemId,
  //     type,
  //     category,
  //     cloth,
  //     packagingType,
  //     extras,
  //     comments,
  //     laundryListId,
  //   } = req.body;
  //   const laundryDetails = await Laundry.findById({ _id: laundryListId });

  //   const result = {
  //     userId,
  //     orders: [
  //       {
  //         itemId,
  //         laundryListId,
  //         type,
  //         category,
  //         cloth,
  //         packagingType,
  //         extras,
  //         comments,
  //         price: laundryDetails.price,
  //       },
  //     ],
  //   };
  //   order = new Order(result);
  //   data = await order.save();
  //   console.log(data.orders.length);

  //   res.send(data);
  // } catch (error) {
  //   res.status(400).json({ statusCode: 400, message: error.message });
  // }
};
module.exports = { placeOrder };
