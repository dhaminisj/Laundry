const mongoose = require("mongoose");
const { single } = require("../utils/multer");

const laundryListSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ["WASH+FOLD", "WASH+IRON", "STEAM IRON", "DRY CLEAN"],
    required: true,
  },
  category: {
    type: String,
    enum: ["MEN", "WOMEN", "KIDS", "HOME"],
    required: true,
  },
  cloth: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  singlePack: {
    type: Number,
    default: 8,
  },
  singlePackImage: { type: String },
  singlePackDescription: {
    type: String,
    default:
      "Want each piece packed single, not ready to mingle? No, that's not unreasonable. To each garment, its own! Items are packed individually, with a cardboard support and in a white paper bag.",
  },
  singlePackUrl: {
    type: String,
    default: "https://www.youtube.com/watch?v=CPUKWMPyOvA",
  },
  hanger: {
    type: Number,
    default: 10,
  },
  hangerImage: { type: String },
  hangerDescription: {
    type: String,
    default:
      "No creases, no folds? Why not let them hang out uncrushed till you waer them? We pack your garment on a hanger, with a compostable outer cover.",
  },
  hangerUrl: {
    type: String,
    default: "https://www.youtube.com/watch?v=GmHgusGNoec",
  },
  multiplePack: {
    type: Number,
    default: 0,
  },
  multipackImage: { type: String },
  multiPackDescription: {
    type: String,
    default:
      "Pack it together, stack it together, you say. Okay. After all, you know your cupboard or suitcase better. Your garments come neatly packed and primed, in a brown paper bag.",
  },
  multiPackUrl: {
    type: String,
    default: "https://www.youtube.com/watch?v=jF3dgfXEgB8",
  },
  starch: {
    type: Number,
    default: 8,
  },
  starchImage: { type: String },
  starchDescription: {
    type: String,
    default: "The process for making clothes wrinkle-free longer",
  },
  starchUrl: {
    type: String,
    default: "https://www.youtube.com/watch?v=GI9Uer-r8cg",
  },
  noStrach: {
    type: Number,
    default: 10,
  },
  noStrachImage: { type: String },
  noStarchDescription: {
    type: String,
    default:
      "It just means that starch is not used in the process of steaming or ironing clothes.",
  },
  noStarchUrl: {
    type: String,
    default: "https://www.youtube.com/watch?v=QsyPECwiolw",
  },
});

module.exports = mongoose.model("laundryList", laundryListSchema);
