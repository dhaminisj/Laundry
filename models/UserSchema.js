const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },
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
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  address: [
    {
      houseNo: { type: String },
      Flat: { type: String },
      pinCode: { type: String },
      city: { type: String },
      Type: { type: String, enum: ["Home", "Work", "Other"], required: true },
    },
  ],
  referalCode: { type: String },
  refreshToken: { type: String },
  wallet: { type: Number, required: true },
});
UserSchema.index({ location: "2dsphere" });
const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
