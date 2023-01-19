const mongoose = require("mongoose");

const promoSchema = mongoose.Schema({
  bankIcon: { type: String },
  bankCode: { type: String },
  discountPercentage: { type: Number },
  discountUpto: { type: Number },
  onOrderAbove: { type: Number },
  title: { type: String },
  description: { type: String },
});
module.exports = mongoose.model("promoModel", promoSchema);
