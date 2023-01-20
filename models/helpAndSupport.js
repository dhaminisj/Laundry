const mongoose = require("mongoose");

const helpAndSupportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "orderModel",
    },
    typeOfHelp: {
        type: String,
        enum: [
            "I need refund for the order",
            "I need to reprocess few items in the order",
            "I need to give feedback for the order",
            "I need to use promo code/discount for the order",
            "I need to make payment for the order",
        ],
        required: true,
    },
    concernText: {
        type: String,
    },
    attachImages: [],
});
module.exports = mongoose.model("helpAndSupportModel", helpAndSupportSchema);
