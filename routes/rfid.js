const express = require("express");
const router = express.Router();

const Student = require("../models/students");
const Attendance = require("../models/attendance");
const Notification = require("../models/notifications");
const SystemLog = require("../models/systemlogs");

// =======================================
// RFID SCAN
// POST /api/rfid/scan
// =======================================

router.post("/scan", async (req, res) => {

    try {

        const { rfid } = req.body;

        if (!rfid) {

            return res.status(400).json({
                success: false,
                message: "RFID is required."
            });

        }

        // Find student by RFID
        const student = await Student.findOne({ rfid });

        if (!student) {

            await Notification.create({
                title: "Unknown RFID",
                message: `Unknown RFID scanned: ${rfid}`,
                type: "warning",
                read: false
            });

            await SystemLog.create({
                activity: "RFID Scan Failed",
                description: `Unknown RFID: ${rfid}`,
                user: "System",
                status: "Failed"
            });

            return res.status(404).json({
                success: false,
                message: "Student not found."
            });

        }

        const now = new Date();

        const today = now.toLocaleDateString();

        // Prevent duplicate attendance for the same day
        const existing = await Attendance.findOne({

            rfid: student.rfid,

            date: today

        });

        if (existing) {

            return res.json({

                success: false,

                message: "Attendance already recorded today."

            });

        }

        // Attendance Status
        let status = "Present";

        if (

            now.getHours() > 7 ||

            (now.getHours() === 7 && now.getMinutes() > 30)

        ) {

            status = "Late";

        }

        // Save Attendance
        const attendance = new Attendance({

            name: student.name,

            rfid: student.rfid,

            grade: student.grade,

            section: student.section,

            status: status,

            date: today,

            time: now.toLocaleTimeString()

        });

        await attendance.save();

        // Save Notification
        await Notification.create({

            title: "Attendance Recorded",

            message: `${student.name} marked ${status}.`,

            type: "attendance",

            read: false

        });

        // Save Log
        await SystemLog.create({

            activity: "RFID Scan",

            description: `${student.name} scanned successfully.`,

            user: "System",

            status: "Success"

        });

        return res.json({

            success: true,

            message: "Attendance recorded successfully.",

            attendance

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;