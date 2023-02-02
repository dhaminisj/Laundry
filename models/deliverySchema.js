const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
  type: { type: String },
  orderId: { type: String },

});
module.exports = mongoose.model("deliveryModel", deliverySchema);
