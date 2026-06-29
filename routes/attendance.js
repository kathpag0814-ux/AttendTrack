const express = require("express");
const router = express.Router();

const Attendance = require("../models/attendance");

// ===========================
// GET ALL ATTENDANCE
// ===========================

router.get("/", async (req, res) => {

    try {

        const attendance = await Attendance.find()
            .sort({ createdAt: -1 });

        res.json(attendance);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ===========================
// GET TODAY'S ATTENDANCE
// ===========================

router.get("/today", async (req, res) => {

    try {

        const today = new Date().toLocaleDateString();

        const attendance = await Attendance.find({
            date: today
        });

        res.json(attendance);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ===========================
// ADD ATTENDANCE
// ===========================

router.post("/", async (req, res) => {

    try {

        const attendance = new Attendance(req.body);

        await attendance.save();

        res.json({

            success: true,

            attendance

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ===========================
// DELETE ATTENDANCE
// ===========================

router.delete("/:id", async (req, res) => {

    try {

        await Attendance.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Attendance deleted."

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