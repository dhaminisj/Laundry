const mongoose = require("mongoose");

const subscriptionListSchema = mongoose.Schema({
    amount:{
        type:Number
    },
    months:{
        type:Number
    },
    numberOfPickups:{
        type:Number
    },
    features:{
        type:Array
    },
    ratings:[
        {
            star: Number,
            postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            createdOn: {
                type: Date,
                default: Date.now(),
            },
        }
    ],
})

module.exports = mongoose.model("SubscriptionList",subscriptionListSchema)