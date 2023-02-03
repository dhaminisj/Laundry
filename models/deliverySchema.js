const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  type: { type: String },
  orderId: { type: String },
  name: { type: String },
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
  isSubscribed: { type: Boolean },
  phone: { type: String },
  isCompleted: { type: Boolean },
  washFold: { type: Number },
  washFoldAmount: { type: Number },
  washIron: { type: Number },
  washIronAmount: { type: Number },
  steamIron: { type: Number },
  steamIronAmount: { type: Number },
  dryClean: { type: Number },
  dryCleanAmount: { type: Number },
  basketTotal: { type: Number },
  tax: { type: Number },
  deliveryCharge: { type: Number },
  discount: { type: Number },
  lmWallet: { type: Number },
  isPaid: { type: Boolean },
});
module.exports = mongoose.model("deliveryModel", deliverySchema);
