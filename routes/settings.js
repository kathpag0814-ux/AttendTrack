const express = require("express");
const router = express.Router();

const Setting = require("../models/settings");

// ======================================
// GET SETTINGS
// ======================================

router.get("/", async (req, res) => {

    try {

        let settings = await Setting.findOne();

        if (!settings) {

            settings = new Setting({

                schoolName: "",

                schoolYear: "",

                semester: "",

                amCutoff: "07:30",

                pmCutoff: "13:00",

                aiSensitivity: "Medium",

                autoPrediction: true,

                emailAlert: true,

                smsAlert: true

            });

            await settings.save();

        }

        res.json(settings);

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ======================================
// SAVE SETTINGS
// ======================================

router.post("/", async (req, res) => {

    try {

        let settings = await Setting.findOne();

        if (!settings) {

            settings = new Setting(req.body);

        }

        else {

            Object.assign(settings, req.body);

        }

        await settings.save();

        res.json({

            success: true,

            message: "Settings saved successfully.",

            settings

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;