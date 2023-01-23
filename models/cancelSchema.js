const mongoose = require("mongoose");
const cancelSchema = mongoose.Schema({
    userId:{
        type:String,
    },
    orderId:{
        type:String
    },
    reason:{
        type:String
    },
    comments:{
        type:String
    }
})

module.exports = mongoose.model("cancel", cancelSchema);