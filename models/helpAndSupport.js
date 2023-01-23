const mongoose = require("mongoose");

const helpAndSupportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderModel",
    },
    typeOfHelp: {
        type: String,
        required: true,
    },
    attachImages: [],
    ticketNumber: {
        type: Number,
    },
    ticketStatus: {
        type: String,
        default: "Raised",
    },
    createdOn: {
        type: Date,
        default: Date.now(),
    },
});
module.exports = mongoose.model("helpAndSupportModel", helpAndSupportSchema);
