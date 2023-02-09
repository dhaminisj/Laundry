const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  type: { type: String },
  orderId: { type: String },
  orderItems: {
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
        price: { type: Number },
        uploadedImage: [],
        packagingType: {
          type: String,
          enum: ["Single Pack", "Multipack", "Hanger"],
        },
        extras: { type: String, enum: ["Starch", "No Starch"] },
        comments: { type: String },
      },
    ],
    selected: { type: String, default: null },
    paymentDetails: {
      basketTotal: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      deliveryCharge: { type: Number },
      discount: { type: Number },
      lmWallet: { type: Number, default: 0 },
      totalPayable: { type: Number },
      totalAmount: { type: Number },
    },
  },
  slot: { type: String },
  noOfItems: { type: Number },
  totalAmount: { type: Number },
  washFold: { type: Number, default: 0 },
  washFoldAmount: { type: Number, default: 0 },
  washIron: { type: Number, default: 0 },
  washIronAmount: { type: Number, default: 0 },
  steamIron: { type: Number, default: 0 },
  steamIronAmount: { type: Number, default: 0 },
  dryClean: { type: Number, default: 0 },
  dryCleanAmount: { type: Number, default: 0 },
  userDetails: {
    phone: { type: String },
    isSubscribed: { type: Boolean },
    name: { type: String },
    deliveryAddress: [
      {
        latitude: { type: Number },
        longitude: { type: Number },
        houseNo: { type: String },
        area: { type: String },
        pinCode: { type: String },
        state: { type: String },
        types: { type: String, enum: ["home", "work", "other"] },
        primary: { type: Boolean },
      },
    ],
  },
  status: {
    isCompleted: { type: Boolean, default: false },
    paymentStatus: { type: Boolean, default: false },
    returnStatus: { type: Boolean, default: false },
  },
});
module.exports = mongoose.model("delivery", deliverySchema);
