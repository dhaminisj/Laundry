const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        laundryListId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "laundryList",
        },
        serviceType: {
          type: String,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        cloth: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
    subTotal: {
      default: 0,
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("cartModel", cartSchema);
