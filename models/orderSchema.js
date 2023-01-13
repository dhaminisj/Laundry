const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  orders: [
    {
      serviceType: {
        type: String,
        enum: ["WASH+FOLD", "WASH+IRON", "STEAM IRON", "DRY CLEAN"],
        required: true,
      },
      category: {
        type: String,
        enum: ["MEN", "WOMEN", "KIDS", "HOME"],
        required: true,
      },
      cloth: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      singlePack: {
        type: Boolean,
        default: false,
      },
      hanger: {
        type: Boolean,
        default: false,
      },
      multiplePack: {
        type: Boolean,
        default: false,
      },
      starch: {
        type: Boolean,
        default: false,
      },
      noStrach: {
        type: Boolean,
        default: false,
      },

      quantity: { type: Number, default: 0 },
    },
  ],
  totalAmount: { type: Number, default: 0 },
});

module.exports = mongoose.model("orderList", orderSchema);
