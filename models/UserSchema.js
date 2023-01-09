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
    },
  },
  address: [
    {
      houseNo: { type: String, required: true },
      Flat: { type: String },
      pinCode: { type: String, required: true },
      city: { type: String, required: true },
      types: { type: String, enum: ["Home", "Work", "Other"], required: true },
      primary: { type: Boolean, required: true },
    },
  ],
  //referalCode: { type: String, required: true },
  refreshToken: { type: String, required: true },
  wallet: { type: Number, required: true },
  plan: { type: Number, required: true },
  totalearned: { type: Number },
 // referandearn :{
    code: { type: String, },
    //reward:{ type: Number, default: 40 },
 // }

});
UserSchema.index({ location: "2dsphere" });
const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
