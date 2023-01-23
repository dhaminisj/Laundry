const mongoose = require("mongoose");
const termsSchema = mongoose.Schema({
  genericTerms: [
    {
      Title: { type: String },
      Body: { type: String },
    },
  ],
  privacyPolicy: [
    {
      Title: { type: String },
      Body: { type: String },
    },
  ],
  // gTitle: { type: String },
  // gBody: { type: String },

  // pTitle: { type: String },
  // pBody: { type: String },
});

const TermsModel = mongoose.model("TermsModel", termsSchema);
module.exports = TermsModel;
