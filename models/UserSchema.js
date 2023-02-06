const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String },
  profilePic: {
    type: String,
    default:
      "https://res.cloudinary.com/dodityyjl/image/upload/v1671174941/pictures/przgw3kern5kyjb0fkox.jpg",
  },

  address: [
    {
      latitude: { type: Number },
      longitude: { type: Number },
      houseNo: { type: String },
      area: { type: String },
      pinCode: { type: String },
      state: { type: String },
      types: { type: String, enum: ["home", "work", "other"] },
      primary: { type: Boolean },
    },
  ],
  //referalCode: { type: String, required: true },
  refreshToken: { type: String },
  wallet: { type: Number, default: 0 },
  plan: { type: Number },
  totalearned: { type: Number, default: 0 },
  // referandearn :{
  code: { type: String },
  isSubscribed: { type: Boolean, default: false },
  //reward:{ type: Number, default: 40 },
  // }
  totalSavedWater: { type: Number, default: 0 },
});
// UserSchema.index({ location: "2dsphere" });
const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
