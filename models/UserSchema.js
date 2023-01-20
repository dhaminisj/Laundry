const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String },
  profilePic: {
    type: String,
    default:
      "http://res.cloudinary.com/dodityyjl/image/upload/v1670903393/image/hb8o0wr3rr9rompysw9g.jpg",
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
  //reward:{ type: Number, default: 40 },
  // }
});
// UserSchema.index({ location: "2dsphere" });
const UserModel = mongoose.model("UserModel", UserSchema);
module.exports = UserModel;
