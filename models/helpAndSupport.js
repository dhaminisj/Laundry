const mongoose = require("mongoose");

const helpAndSupportSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: {
        type: String,
        ref: "orderModel",
    },
    describeText: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
        },
    ],
    ticketNumber: {
        type: String,
         default: "#001",
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
