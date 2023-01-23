const mongoose = require("mongoose");
const cancelReasonSchema = mongoose.Schema({
  reason: {
    type: String,
  },
});
module.exports = mongoose.model("cancelReason", cancelReasonSchema);
