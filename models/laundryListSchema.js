const mongoose = require("mongoose");

const laundryListSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ["wash+fold", "wash+iron", "steamIron", "dryClean"],
    required: true,
  },
  category: {
    type: String,
    enum: ["men", "women", "kids", "home"],
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
  addOn: 
    {
      packaging: 
        {
          singlePack: {
            type: Number,
            default: 8,
          },
          hanger: { type: Number, default: 10 },
          multiplePack: { type: Number, default: 20 },
        },
      extras: 
        {
          starch: { type: Number, default: 8 },
          noStrach: { type: Number, default: 10 },
        },
      
    },
  
});

module.exports = mongoose.model("laundryList", laundryListSchema);
