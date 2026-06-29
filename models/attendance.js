const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    grade: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    rfid: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Present"
    },

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "Attendance",
    AttendanceSchema
);