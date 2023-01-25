const faqModel = require("./faqSchema");
const TermsModel = require("./termsAndServices");
const UserModel = require("./UserSchema");
const PlayVideoModel = require("./playVideoSchema");
module.exports = {
  User: UserModel,
  Terms: TermsModel,
  FAQ: faqModel,
  PlayVideo: PlayVideoModel,
};
