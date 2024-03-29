const mongoose = require("mongoose");
const subscriptionSchema = mongoose.Schema({
  userId: {
    type: String,
  },
  orderId: {
    type: String,
  },
  pickupDays: {
    pickupDays: [],
    deliveryDays: [],
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
  },
  subscription: {
    amount: {
      type: Number,
    },
    months: {
      type: Number,
    },
    numberOfPickups: {
      type: Number,
    },
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

  address: {
    houseNo: {
      type: String,
    },
    road: {
      type: String,
    },
    cityAndState: {
      type: String,
    },
    pincode: {
      type: String,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    addressType: {
      type: String,
    },
    fullAddress: {
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
    },
    cardType: {
      type: String,
    },
  },
  isWallet: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("buySubscription", subscriptionSchema);
