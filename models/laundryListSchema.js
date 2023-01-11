const mongoose = require("mongoose");

const laundryListSchema = mongoose.Schema({
  type: {
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
  image: {
    type: String,
  },

  singlePack: {
    type: Number,
    default: 8,
  },
  hanger: { type: Number, default: 10 },
  multiplePack: { type: Number, default: 20 },

  starch: { type: Number, default: 8 },
  noStrach: { type: Number, default: 10 },
});

module.exports = mongoose.model("laundryList", laundryListSchema);
