const mongoose = require("mongoose");

const ratingsSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      ratings:[
        {
            star: Number,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdOn: {
                type: Date,
                default: Date.now(),
            },
        },
    ],
    totalrating: {
        type: Number,
        default: 0,
    },
})
module.exports = mongoose.model("ratingsModel",ratingsSchema)
