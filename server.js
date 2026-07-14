// ===========================================
// AttendTrack AI + RFID Attendance System
// server.js
// ===========================================

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ===========================================
// Middleware
// ===========================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ===========================================
// MongoDB Connection
// ===========================================

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Atlas Connected Successfully");
})
.catch((err) => {
    console.error("MongoDB Error:", err);
});

// ===========================================
// Models
// ===========================================

const Student = require("./models/students");
const Attendance = require("./models/attendance");
const Notification = require("./models/notifications");
const Setting = require("./models/settings");
const SystemLog = require("./models/systemlogs");

// ===========================================
// Routes
// ===========================================

const studentRoutes = require("./routes/students");
const attendanceRoutes = require("./routes/attendance");
const aianalyticsRoutes = require("./routes/aianalytics");
const reportRoutes = require("./routes/reports");
const notificationRoutes = require("./routes/notifications");
const settingRoutes = require("./routes/settings");
const systemLogRoutes = require("./routes/systemlogs");
const rfidRoutes = require("./routes/rfid");

// ===========================================
// API Routes
// ===========================================

app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/aianalytics", aianalyticsRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/systemlogs", systemLogRoutes);
app.use("/api/rfid", rfidRoutes);

console.log("✅ Students route registered");

// ===========================================
// Home Page
// ===========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===========================================
// Helper Functions
// ===========================================

async function addNotification(title, message, type = "system") {
    try {
        await Notification.create({
            title,
            message,
            type,
            read: false,
            createdAt: new Date()
        });
    } catch (err) {
        console.log(err);
    }
}

async function addSystemLog(activity, description, status = "Success") {
    try {
        await SystemLog.create({
            activity,
            description,
            user: "Administrator",
            status,
            createdAt: new Date()
        });
    } catch (err) {
        console.log(err);
    }
}

// ===========================================
// RFID Scan API
// ===========================================

app.post("/api/scan", async (req, res) => {

    try {

        const { rfid } = req.body;

        if (!rfid) {
            return res.status(400).json({
                success: false,
                message: "RFID is required."
            });
        }

        const student = await Student.findOne({ rfid });

        if (!student) {

            await addNotification(
                "RFID Scan Failed",
                `Unknown RFID: ${rfid}`,
                "warning"
            );

            await addSystemLog(
                "RFID Failed",
                `Unknown RFID: ${rfid}`,
                "Failed"
            );

            return res.status(404).json({
                success: false,
                message: "Student not found."
            });

        }

        const today = new Date().toLocaleDateString();

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

        let status = "Present";

        const now = new Date();

        if (
            now.getHours() > 7 ||
            (now.getHours() === 7 && now.getMinutes() > 30)
        ) {
            status = "Late";
        }

                const attendance = await Attendance.create({

            studentId: student._id,

            name: student.name,

            grade: student.grade,

            section: student.section,

            rfid: student.rfid,

            status,

            date: today,

            time: now.toLocaleTimeString()

        });

        await addNotification(

            "Attendance Recorded",

            `${student.name} marked ${status}.`,

            "attendance"

        );

        await addSystemLog(

            "RFID Scan",

            `${student.name} scanned successfully.`,

            "Success"

        );

        res.json({

            success: true,

            attendance

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ===========================================
// Dashboard API
// ===========================================

app.get("/api/dashboard", async (req, res) => {

    try {

        const totalStudents = await Student.countDocuments();

        const today = new Date().toLocaleDateString();

        const attendanceToday = await Attendance.find({ date: today });

        const presentToday = attendanceToday.filter(
            x => x.status === "Present"
        ).length;

        const lateToday = attendanceToday.filter(
            x => x.status === "Late"
        ).length;

        const absentToday = Math.max(
            totalStudents - presentToday - lateToday,
            0
        );

        const attendanceRate = totalStudents > 0
            ? (((presentToday + lateToday) / totalStudents) * 100).toFixed(1)
            : 0;

        res.json({

            totalStudents,

            presentToday,

            lateToday,

            absentToday,

            attendanceRate

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ===========================================
// Analytics API
// ===========================================

app.get("/analytics", async (req, res) => {

    try {

        const students = await Student.countDocuments();

        const attendance = await Attendance.find();

        const present = attendance.filter(
            a => a.status === "Present"
        ).length;

        const late = attendance.filter(
            a => a.status === "Late"
        ).length;

        const absent = Math.max(
            students - present - late,
            0
        );

        const score = students > 0
            ? Math.round(((present + late) / students) * 100)
            : 0;

        res.json({

            students,

            present,

            late,

            absent,

            score

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ===========================================
// Reports API
// ===========================================

app.get("/reports", async (req, res) => {

    try {

        const reports = await Attendance.find().sort({ _id: -1 });

        res.json(reports);

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ===========================================
// Notifications API
// ===========================================

app.get("/notifications", async (req, res) => {

    const notifications = await Notification.find().sort({ _id: -1 });

    res.json(notifications);

});

app.put("/notifications/:id", async (req, res) => {

    await Notification.findByIdAndUpdate(

        req.params.id,

        { read: true }

    );

    res.json({

        success: true

    });

});

// ===========================================
// Settings API
// ===========================================

app.get("/settings", async (req, res) => {

    let settings = await Setting.findOne();

    if (!settings) {

        settings = await Setting.create({});

    }

    res.json(settings);

});

app.put("/settings", async (req, res) => {

    let settings = await Setting.findOne();

    if (!settings) {

        settings = new Setting(req.body);

    } else {

        Object.assign(settings, req.body);

    }

    await settings.save();

    res.json({

        success: true,

        settings

    });

});

// ===========================================
// System Logs API
// ===========================================

app.get("/systemlogs", async (req, res) => {

    const logs = await SystemLog.find().sort({ _id: -1 });

    res.json(logs);

});

app.delete("/systemlogs", async (req, res) => {

    await SystemLog.deleteMany({});

    res.json({

        success: true

    });

});

// ===========================================
// Start Server
// ===========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");
    console.log("=======================================");
    console.log(" AttendTrack Server Running");
    console.log(` http://localhost:${PORT}`);
    console.log("=======================================");
    console.log("");

});
