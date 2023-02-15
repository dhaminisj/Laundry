const mongoose = require("mongoose");
const imageSchema = mongoose.Schema({
  userId: { type: String },
  uploadedImage: [],
});

module.exports = mongoose.model("imageModel", imageSchema);
