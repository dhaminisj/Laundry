const mongoose = require("mongoose");
const termsSchema = mongoose.Schema({
  genericTerms: [
    {
      genericTermsTitle: { type: String },
      genericTermsBody: { type: String },
    },
  ],
  privacyPolicy: [
    {
      privacyPolicyTitle: { type: String },
      privacyPolicyBody: { type: String },
    },
  ],
  // gTitle: { type: String },
  // gBody: { type: String },

  // pTitle: { type: String },
  // pBody: { type: String },
});

const TermsModel = mongoose.model("TermsModel", termsSchema);
module.exports = TermsModel;
