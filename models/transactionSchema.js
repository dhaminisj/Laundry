const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    userId: {
        type: String,
      },
    orderId:{
        type: String
    },
    totalPrice: {
        type: Number,
        
    },
    walletBalance:{
      type:Number
    },
    transactionType:{
        type: String,
    },
    paidAt: {
        type: Date,
        default:Date.now()
    },
  }
);
module.exports = mongoose.model("transactionModel", transactionSchema);
