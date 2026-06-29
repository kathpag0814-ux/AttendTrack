const express = require("express");
const router = express.Router();

const Attendance = require("../models/attendance");

// =====================================
// GET ALL REPORTS
// =====================================

router.get("/", async (req, res) => {

    try {

        const reports = await Attendance.find()
            .sort({ createdAt: -1 });

        res.json(reports);

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// =====================================
// GET REPORT BY DATE
// =====================================

router.get("/:date", async (req, res) => {

    try {

        const reports = await Attendance.find({

            date: req.params.date

        });

        res.json(reports);

    }

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

// =====================================
// EXPORT REPORT
// =====================================

router.get("/export/json", async (req, res) => {

    try {

        const reports = await Attendance.find();

        res.json({

            success: true,

            total: reports.length,

            reports

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