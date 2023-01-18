const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  walletBalance: {
    type: Number,
  },
  transactionType: {
    type: String,
  },
  paidAt: {
    type: Date,
    default: Date.now(),
  },
  card: {
    number: {
      type: String,
    },
    name: {
      type: String,
    },
    expDate: {
      type: String,
    },
    cardType: {
      type: String,
    },
  },
});
module.exports = mongoose.model("transactionModel", transactionSchema);
