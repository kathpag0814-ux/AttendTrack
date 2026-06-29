const express = require("express");
const router = express.Router();

const Student = require("../models/students");
const Attendance = require("../models/attendance");
const Notification = require("../models/notifications");
const SystemLog = require("../models/systemlogs");

// ===========================
// RFID SCAN
// ===========================

router.post("/scan", async (req, res) => {

    try {

        const { rfid } = req.body;

        if (!rfid) {

            return res.status(400).json({
                success: false,
                message: "RFID is required."
            });

        }

        // Find student
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

        // Prevent duplicate attendance
        const existing = await Attendance.findOne({
            studentId: student.studentId,
            date: today
        });

        if (existing) {

            return res.json({
                success: false,
                message: "Attendance already recorded today."
            });

        }

        // Determine attendance status
        let status = "Present";

        if (
            now.getHours() > 7 ||
            (now.getHours() === 7 && now.getMinutes() > 30)
        ) {
            status = "Late";
        }

        // Save attendance
        const attendance = await Attendance.create({

            studentId: student.studentId,

            name: student.name,

            grade: student.grade,

            section: student.section,

            rfid: student.rfid,

            status,

            date: today,

            time: now.toLocaleTimeString()

        });

        // Notification
        await Notification.create({

            title: "Attendance Recorded",

            message: `${student.name} marked ${status}.`,

            type: "attendance",

            read: false

        });

        // System Log
        await SystemLog.create({

            activity: "RFID Scan",

            description: `${student.name} scanned successfully.`,

            user: "System",

            status: "Success"

        });

        res.json({

            success: true,

            student,

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

module.exports = router;