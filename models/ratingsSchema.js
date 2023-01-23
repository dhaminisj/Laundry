const mongoose = require("mongoose");

const ratingsSchema = mongoose.Schema({
    orderId: {
        type: String,
        ref: "orderModel",
    },
    star: Number,
    postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdOn: {
        type: Date,
        default: Date.now(),
    },
});
module.exports = mongoose.model("ratingsModel", ratingsSchema);
