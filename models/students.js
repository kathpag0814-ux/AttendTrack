const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true,
        unique: true
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
        required: true,
        unique: true
    }

}, {

    timestamps: true

});

module.exports = mongoose.model(
    "Student",
    StudentSchema
);