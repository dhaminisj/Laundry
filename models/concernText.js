const mongoose = require("mongoose");

const concernTextSchema = mongoose.Schema({
    concernText: {
        type: Array,
    },
});

module.exports = mongoose.model("concernTextList", concernTextSchema);
