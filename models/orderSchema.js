const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: { type: String },
    orders: [
      {
        itemId: { type: String },
        laundryListId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "laundryList",
        },
        type: {
          type: String,
          enum: ["WASH+FOLD", "WASH+IRON", "STEAM IRON", "DRY CLEAN"],
          required: true,
        },
        category: {
          type: String,
          enum: ["MEN", "WOMEN", "KIDS", "HOME"],
          required: true,
        },
        cloth: {
          type: String,
          required: true,
        },
        uploadedImage: [],
        packagingType: {
          type: String,
          enum: ["Single Pack", "Multipack", "Hanger"],
        },
        extras: { type: String, enum: ["Starch", "No Starch"] },
        comments: { type: String },
      },
    ],
    basketTotal: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    deliveryCharge: { type: Number, default: 50 },
    tax: { type: Number },
    noOfItems: { type: Number },
    deliveryAddress: [
      {
        latitude: { type: String },
        longitude: { type: String },
        houseNo: { type: String },
        flat: { type: String },
        pinCode: { type: String },
        city: { type: String },
        types: { type: String, enum: ["home", "work", "other"] },
        primary: { type: Boolean },
      },
    ],
    savedWater: { type: Number },
    orderStatus: { type: String, enum: ["Pending", "Completed"] },
    pickupDays: [
      {
        pickupDays: { type: String },
        deliveryDays: { type: String },
        deliveryType: {
          type: String,
        },
        deliverySlot: {
          type: String,
        },
      },
    ],
    isWallet: {
      type: Boolean,
      default: false,
    },
    card: {
      number: {
        type: String,
      },
      name: {
        type: String,
      },
      expDate: {
        type: String,
      },
      cardType: {
        type: String,
      },
    },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);
module.exports = mongoose.model("orderModel", orderSchema);
