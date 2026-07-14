const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    
    studentId: {
        type: String,
        unique: true
    },

    name: {
        type: String,
        required: true
    },

    rfid: {
        type: String,
        required: true,
        unique: true
    },

    grade: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: "Active"
    }

}, {

    timestamps: true

});

module.exports = mongoose.model("Student", studentSchema);