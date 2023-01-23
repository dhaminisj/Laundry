const mongoose = require("mongoose");

const burgerPromoSchema = mongoose.Schema({
  promoTitle: { type: String },
  promoDescription: { type: String },
  offers: [
    {
      offerTitle: { type: String },
      expireDate: { type: Date },
      promoCode: { type: String },
    },
  ],
});
module.exports = mongoose.model("burgerPromoModel", burgerPromoSchema);
