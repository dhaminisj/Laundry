const mongoose = require("mongoose");
const faqSchema = mongoose.Schema({
  "Orders and Payments": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  "Offers and Discounts": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  "Cashbacks": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  "Available Services": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  "Pick-Up & Delivery": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  "Covid-19 Protocols": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  "Subscription": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  "Returns and Reprocessing": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
  "Address Management": [
    {
      title: { type: String },
      body: { type: String },
    },
  ],
});

const faqModel = mongoose.model("faqModel", faqSchema);
module.exports = faqModel;
