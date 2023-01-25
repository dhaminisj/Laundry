const mongoose = require("mongoose");
const playVideoSchema = new mongoose.Schema({
  data: [
    {
      title: {
        type: String,
        enum: ["WASH + FOLD", "WASH + IRON", "STEAM IRON", "DRY CLEAN"],
        required: true,
      },
      description: { type: String },
      imageAssest: { type: String },
      videoLink: {
        type: String,
        default: "https://youtu.be/ME155hMLRjQ",
      },
    },
  ],
});
const PlayVideoModel = mongoose.model("PlayVideoModel", playVideoSchema);
module.exports = PlayVideoModel;
