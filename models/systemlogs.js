const mongoose = require("mongoose");

const SystemLogSchema = new mongoose.Schema({

    activity: String,

    description: String,

    user: String,

    status: String

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "SystemLog",
    SystemLogSchema
);