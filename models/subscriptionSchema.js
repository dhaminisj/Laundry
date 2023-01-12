const mongoose = require("mongoose");
const subscriptionSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  pickupDays: [
    {
      pickupDays: [],
      deliveryDays: [],
    },
  ],
  amount: {
    type: Number,
  },
  months: {
    type: Number,
  },
  numberOfPickups: {
    type: Number,
  },
  isPaused: {
    type: Boolean,
    default: false,
  },
  ifPaused: [
    {
      from: {
        type: Date,
      },
      to: {
        type: Date,
      },
    },
  ],
  subscriptionStart: {
    type: Date,
  },
  subscriptionEnd: {
    type: Date,
  },
  deliveryType: {
    type: String,
  },
  deliverySlot: {
    type: String,
  },
  address: {
    title: {
      type: String,
    },
    address: {
      type: String,
    },
    district: {
      type: String,
    },
    pincode: {
      type: String,
    },
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
    }
  },
});

module.exports = mongoose.model("buySubscription", subscriptionSchema);
