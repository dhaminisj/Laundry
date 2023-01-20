const mongoose = require("mongoose");
const faqSchema = mongoose.Schema({
  ordersAndPayment: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  offersAndDiscount: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  cashbacks: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  availableServices: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  pickUpandDelivery: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  covidProtocols: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  subscription: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  returnAndReprocessing: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  addressManagement: [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
});

const faqModel = mongoose.model("faqModel", faqSchema);
module.exports = faqModel;
