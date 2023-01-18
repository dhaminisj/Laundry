const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    notification: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    viewStatus: {
        type: Boolean,
        default: false, // false = unviewed ; true = viewed
    },
    dateTime: {
        type: Date,
        default: Date.now(),
    },
});
module.exports = mongoose.model("notificationModel", notificationSchema);
