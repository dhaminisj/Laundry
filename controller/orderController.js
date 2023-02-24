const Order = require("../models/orderSchema");
const User = require("../models/UserSchema");
const Laundry = require("../models/laundryListSchema");
const mongoose = require("mongoose");
const Promo = require("../models/promoSchema");
const transcation = require("../models/transactionSchema");
const Image = require("../models/ImageSchema");
const cloudinary = require("../utils/cloudinaryConfig");

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

    let basketTotal = 0,
      deliveryCharge = 50;
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
      orderId: "#LM" + Math.random().toString(10).slice(3),
      orders: list,
      basketTotal,
      tax: basketTotal * 0.3,
      totalAmount: parseFloat(basketTotal + basketTotal * 0.3 + deliveryCharge),
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

const emptyBasket = async (req, res) => {
  try {
    const { userId } = req.users;
    const { checkoutId } = req.body;

    Order.findOneAndDelete({ _id: checkoutId }, function (err, docs) {
      if (err) return res.status(400).json(err);
      if (docs == null)
        return res.status(401).json({
          status: false,
          statusCode: 401,
          message: "Unable to remove items from basket.",
        });
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "Items removed from basket successfully.",
      });
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};
const getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.users;
    const orderHistory = await Order.find({}).select([
      "noOfItems",
      "basketTotal",
      "pickupDays.pickupDays",
      "pickupDays.deliveryDays",
      "pickupDays.deliverySlot",
      "createdAt",
      "-_id",
    ]);
    res.status(200).send({
      status: true,
      statusCode: 200,
      data: orderHistory,
    });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};
let totalAmount, discount;
const addressAndSlot = async (req, res) => {
  try {
    const { userId } = req.users;
    const { address, checkoutId, pickupAndDelivery } = req.body;
    const [orderData] = await Order.find({ _id: checkoutId });

    const result = await Order.findByIdAndUpdate(
      { _id: checkoutId },
      {
        $set: {
          deliveryAddress: {
            latitude: address.latitude,
            longitude: address.longitude,
            houseNo: address.houseNo,
            area: address.area,
            pinCode: address.pinCode,
            state: address.state,
            types: address.types,
            primary: address.primary,
          },
          pickupAndDelivery: {
            pickupDate: pickupAndDelivery.pickupDate,
            deliveryDate: pickupAndDelivery.deliveryDate,
            slot: pickupAndDelivery.slot,
          },
        },
      },
      { new: true }
    );

    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Address, pickup and delivery slot added successfully.",
        result,
        totalAmount: totalAmount,
        discount: discount,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not add address, pickup and delivery slot.",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const applyPromo = async (req, res) => {
  try {
    const { userId } = req.users;
    const { checkoutId, bankCode } = req.body;
    const [order] = await Order.find({ _id: checkoutId });
    const [promoCode] = await Promo.find({ bankCode });

    if (promoCode) {
      if (order.totalAmount > promoCode.onOrderAbove) {
        discount = order.totalAmount * [promoCode.discountPercentage / 100];
        if (discount < parseInt(promoCode.discountUpto)) {
          totalAmount = order.totalAmount - discount;
          discount = discount;
        } else {
          totalAmount = order.totalAmount - promoCode.discountUpto;
          discount = promoCode.discountUpto;
        }

        res.status(200).json({
          statusCode: 200,
          message: "Promo code applied successfully.",
          totalAmount: totalAmount,
          discount: discount,
        });
      } else {
        res
          .status(400)
          .json({ statusCode: 400, message: "Promo code is not applicable." });
      }
    } else {
      res
        .status(404)
        .json({ statusCode: 404, message: "No promo code found." });
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const payment = async (req, res) => {
  try {
    const { checkoutId, bankCode } = req.body;
    const [order] = await Order.find({ _id: req.body.checkoutId });

    const [user] = await User.find({ _id: req.users.userId });
    const savedWater = parseInt(order.noOfItems * 2);
    const totalSavedWater = parseInt(user.totalSavedWater + savedWater);
    const [promoCode] = await Promo.find({ bankCode });
    if (promoCode) {
      if (order.totalAmount > promoCode.onOrderAbove) {
        discount = order.totalAmount * [promoCode.discountPercentage / 100];
        if (discount < parseInt(promoCode.discountUpto)) {
          totalAmount = order.totalAmount - discount;
          discount = discount;
        } else {
          totalAmount = order.totalAmount - promoCode.discountUpto;
          discount = promoCode.discountUpto;
        }
      }
    }
    await Order.findByIdAndUpdate(
      { _id: checkoutId },
      { totalAmount: totalAmount, discount: discount }
    );
    let amount, fromOtherSource;
    if (req.body.isWallet) {
      if (user.wallet > order.totalAmount) {
        amount = user.wallet - order.totalAmount;
        await User.findByIdAndUpdate(
          { _id: req.users.userId },
          { wallet: amount }
        );
        await transcation.create({
          userId: req.users.userId,
          orderId: order.orderId,
          totalPrice: order.totalAmount,
          walletBalance: amount,
          orderTitle: "ORDER",
          transactionType: "PAYMENT",
          transactionStatus: "DEBIT",
        });
        await User.findOneAndUpdate(
          { _id: req.users.userId },
          { totalSavedWater: totalSavedWater }
        );
        await Order.findOneAndUpdate(
          { _id: req.body.checkoutId },
          {
            orderConfirmed: true,
            fromWallet: order.totalAmount,
            fromOtherSource: 0,
            isPaid: true,
          }
        );
        res.status(200).json({
          statusCode: 200,
          message: "Order placed money debited from wallet.",
        });
      } else if (user.wallet > 0) {
        await User.findByIdAndUpdate({ _id: req.users.userId }, { wallet: 0 });
        await transcation.create({
          userId: req.users.userId,
          orderId: order.orderId,
          totalPrice: user.wallet,
          walletBalance: 0,
          orderTitle: "ORDER",
          transactionType: "PAYMENT",
          transactionStatus: "DEBIT",
        });
        fromOtherSource = parseFloat(order.totalAmount - user.wallet);
        await User.findOneAndUpdate(
          { _id: req.users.userId },
          {
            totalSavedWater: totalSavedWater,
            "card.number": req.body.card.number,
            "card.name": req.body.card.name,
            "card.expDate": req.body.card.expDate,
            "card.cardType": req.body.card.cardType,
          }
        );
        await User.findOneAndUpdate(
          { _id: req.users.userId },
          { totalSavedWater: totalSavedWater }
        );
        await Order.findOneAndUpdate(
          { _id: req.body.checkoutId },
          {
            orderConfirmed: true,
            fromOtherSource: fromOtherSource,
            fromWallet: user.wallet,
            isPaid: true,
          }
        );
        res.status(200).json({
          statusCode: 200,
          message: "Order placed money debited from wallet + card.",
        });
      } else {
        res.status(400).json({
          statusCode: 400,
          message: "Balance is zero. Please choose other payment method.",
        });
      }
    } else if (req.body.card) {
      await Order.findByIdAndUpdate(
        { _id: req.body.checkoutId },
        {
          "card.number": req.body.card.number,
          "card.name": req.body.card.name,
          "card.expDate": req.body.card.expDate,
          "card.cardType": req.body.card.cardType,
        }
      );
      await User.findOneAndUpdate(
        { _id: req.users.userId },
        { totalSavedWater: totalSavedWater }
      );
      await Order.findOneAndUpdate(
        { _id: req.body.checkoutId },
        {
          orderConfirmed: true,
          fromWallet: 0,
          fromOtherSource: order.totalAmount,
          isPaid: true,
        }
      );
      res.status(200).json({
        statusCode: 200,
        message: "Order placed money debited from " + req.body.card.cardType,
      });
    } else {
      await User.findOneAndUpdate(
        { _id: req.users.userId },
        { totalSavedWater: totalSavedWater }
      );
      await Order.findOneAndUpdate(
        { _id: req.body.checkoutId },
        {
          orderConfirmed: true,
          fromWallet: 0,
          fromOtherSource: order.totalAmount,
        }
      );
      res
        .status(200)
        .json({ statusCode: 200, message: "Order placed COD opted." });
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};
const invoice = async (req, res) => {
  try {
    const { userId } = req.users;
    const { checkoutId } = req.body;
    const result = await Order.find({ _id: checkoutId });
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Invoice fetched.",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not get invoice.",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const uploadImages = async (req, res) => {
  try {
    const { userId } = req.users;
    uploadFiles = [];
    for (i = 0; i < req.files.length; i++) {
      uploadFiles.push(req.files[i].path);
    }
    uploadfile = [];
    for (i = 0; i < uploadFiles.length; i++) {
      const upload = await cloudinary.uploader.upload(uploadFiles[i], {
        folder: "Image",
        use_filename: true,
      });
      uploadUrl = upload.url;
      uploadfile.push(uploadUrl);
    }
    const result = await Image.create({
      uploadedImage: uploadfile,
      userId,
    });
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Images uploaded successfully.",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not upload images.",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.users;
    const result = await Order.find({ userId, orderConfirmed: true });
    if (result)
      res.status(200).json({
        statusCode: 200,
        message: "Orders fetched successfully.",
        result,
      });
    else
      res.status(400).json({
        statusCode: 400,
        message: "Could not fetch orders.",
      });
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
};
module.exports = {
  checkoutOrder,
  addressAndSlot,
  applyPromo,
  payment,
  invoice,
  getOrderHistory,
  emptyBasket,
  uploadImages,
  getUserOrders,
};
