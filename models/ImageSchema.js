const mongoose = require("mongoose");
const imageSchema = mongoose.Schema({
  userId: { type: String },
  image: [],
});

module.exports = mongoose.model("imageModel", imageSchema);
