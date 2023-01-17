const mongoose = require("mongoose");

const ratingsSchema = mongoose.Schema({
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionList",
    },
    // ratings: [
    //     {
    star: Number,
    postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdOn: {
        type: Date,
        default: Date.now(),
    },
    //     },
    // ],
});
module.exports = mongoose.model("ratingsModel", ratingsSchema);
