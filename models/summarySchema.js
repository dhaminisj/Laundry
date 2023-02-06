const mongoose = require("mongoose");

const summarySchema = new mongoose.Schema({
  status: { type: String },
  date: { type: Date },
  slot: { type: String },
  deliveryOrders: { type: Number },
  deliveryBags: { type: Number },
  pickup: { type: Number },
  pickupBags: { type: Number },
  totalCashCollected: { type: Number },
  totalOrders: { type: String },
  vanNumber: { type: String },
});
module.exports = mongoose.model("summaryModel", summarySchema);
