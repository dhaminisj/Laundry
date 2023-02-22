const mongoose = require("mongoose");
const deliveryUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  profilePic: {
    type: String,
    default:
      "https://res.cloudinary.com/dodityyjl/image/upload/v1671174941/pictures/przgw3kern5kyjb0fkox.jpg",
  },
  refreshToken: { type: String },
});
module.exports = mongoose.model("deliveryUserModel", deliveryUserSchema);
