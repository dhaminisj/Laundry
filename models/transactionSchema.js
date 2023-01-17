const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    orderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cart",
    },
    totalPrice: {
        type: Number,
        required: true
    },
    paymentMethod:{
        type: String,
    enum: ["LM Wallet", "Debit Card", "Credit Card","Wallet-Paytm","UPI App"],
    required: true,
    },
    transactionId:{
        type: String
    },
    isPaid:{
        type: Boolean,
    },
    paidAt: {
        type: Date,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("transactionModel", transactionSchema);
