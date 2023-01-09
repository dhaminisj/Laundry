const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String },
  profilePic: {
    public_id: {
      type: String,
      default:
        "https://res.cloudinary.com/dodityyjl/image/upload/v1670903393/image/hb8o0wr3rr9rompysw9g.jpg",
    },
    url: {
      type: String,
    },
  },
  latitude: { type: Number },
  longitude: { type: Number },
  address: [
    {
      houseNo: { type: String },
      flat: { type: String },
      pinCode: { type: String },
      city: { type: String },
      types: { type: String, enum: ["home", "work", "other"] },
      primary: { type: Boolean },
    },
  ],
  //referalCode: { type: String, required: true },
  refreshToken: { type: String },
  wallet: { type: Number },
  plan: { type: Number },
  totalearned: { type: Number },
  // referandearn :{
  code: { type: String },
  //reward:{ type: Number, default: 40 },
  // }
});
// UserSchema.index({ location: "2dsphere" });
const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
