const mongoose = require("mongoose");
const deliveryUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  profilePic: {
    type: String,
    default:
      "http://res.cloudinary.com/dodityyjl/image/upload/v1677057851/Image/3e2bfb60ce04597982f37a1dc6690d1f_nubsbg.png",
  },
  refreshToken: { type: String },
});
module.exports = mongoose.model("deliveryUserModel", deliveryUserSchema);
