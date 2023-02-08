const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  type: { type: String },
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
  noOfItems: { type: Number },
  totalAmount: { type: Number },
  slot: { type: String },
  isCompleted: { type: Boolean },
  washFold: { type: Number, default: 0 },
  washFoldAmount: { type: Number, default: 0 },
  washIron: { type: Number, default: 0 },
  washIronAmount: { type: Number, default: 0 },
  steamIron: { type: Number, default: 0 },
  steamIronAmount: { type: Number, default: 0 },
  dryClean: { type: Number, default: 0 },
  dryCleanAmount: { type: Number, default: 0 },
  basketTotal: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  deliveryCharge: { type: Number },
  discount: { type: Number },
  lmWallet: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
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
});
module.exports = mongoose.model("deliverySchema", deliverySchema);
