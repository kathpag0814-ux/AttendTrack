const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({

    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },

    name: String,

    rfid: String,

    grade: String,

    section: String,

    status: String,

    date: String,

    time: String

}, {

    timestamps: true

});

module.exports = mongoose.model("Attendance", attendanceSchema);