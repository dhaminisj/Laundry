const faqModel = require("./faqSchema");
const TermsModel = require("./termsAndServices");
const UserModel = require("./UserSchema");
module.exports = {
  User: UserModel,
  Terms: TermsModel,
  FAQ: faqModel,
};
