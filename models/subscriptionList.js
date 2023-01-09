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
    }
})

module.exports = mongoose.model("SubscriptionList",subscriptionListSchema)