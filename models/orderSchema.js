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
    deliveryAddress: [
      {
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
    pickupDays: {
      pickupDays: [],
      deliveryDays: [],
      deliveryType: {
        type: String,
      },
      deliverySlot: {
        type: String,
      },
    },
    paymentMethod: {
      type: String,
      enum: ["LM Wallet", "Debit Card", "Credit Card", "COD"],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("orderModel", orderSchema);
