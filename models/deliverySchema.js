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
  noOfItems: { type: Number },
  totalAmount: { type: Number },
});
module.exports = mongoose.model("deliveryModel", deliverySchema);
