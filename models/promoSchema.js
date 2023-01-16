const mongoose = require("mongoose");

const promoSchema = mongoose.Schema({
  promoCode: { type: String },
  description: { type: String },
});
module.exports = mongoose.model("promoModel", promoSchema);
