const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({

    schoolName: {

        type: String,

        default: "AttendTrack"

    },

    schoolYear: {

        type: String,

        default: "2026-2027"

    },

    semester: {

        type: String,

        default: "1st Semester"

    },

    amCutoff: {

        type: String,

        default: "07:30"

    },

    pmCutoff: {

        type: String,

        default: "13:00"

    },

    aiSensitivity: {

        type: String,

        default: "Medium"

    },

    autoPrediction: {

        type: Boolean,

        default: true

    },

    emailAlert: {

        type: Boolean,

        default: true

    },

    smsAlert: {

        type: Boolean,

        default: true

    }

});

module.exports = mongoose.model(
    "Setting",
    SettingSchema
);