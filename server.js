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

// ================================
// Middleware
// ================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// ================================
// MongoDB Connection
// ================================

mongoose.connect(process.env.MONGODB_URI)

.then(() => {
  console.log("MongoDB Atlas Connected Successfully");
})
.catch((err) => {
  console.error(err);
});


// Models
// ===============================
const student = require("./models/students");

const attendance = require("./models/attendance");

const notification = require("./models/notifications");

const setting = require("./models/settings");

const systemLog = require("./models/systemlogs");

// ================================
// Routes
// ================================

const studentRoutes = require("./routes/students");

const attendanceRoutes = require("./routes/attendance");

const aianalyticsRoutes = require("./routes/aianalytics");

const reportRoutes = require("./routes/reports");

const notificationRoutes = require("./routes/notifications");

const settingRoutes = require("./routes/settings");

const systemLogRoutes = require("./routes/systemlogs");

const rfidRoutes = require("./routes/rfid");

// ================================
// API Routes
// ================================

app.use("/students", studentRoutes);

app.use("/attendance", attendanceRoutes);

app.use("/aianalytics", aianalyticsRoutes);

app.use("/reports", reportRoutes);

app.use("/notifications", notificationRoutes);

app.use("/settings", settingRoutes);

app.use("/systemlogs", systemLogRoutes);

app.use("/rfid", rfidRoutes);

// ================================
// Home Page
// ================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

// ==========================================
// Helper Functions
// ==========================================

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

// ==========================================
// RFID Scan
// ==========================================

app.post("/scan", async (req, res) => {

    try {

        const { rfid } = req.body;

        const student =
        await Student.findOne({ rfid });

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

        const now = new Date();

        const today =
        now.toLocaleDateString();

        const alreadyScanned =
        await Attendance.findOne({

            studentId: student.studentId,
            date: today

        });

        if (alreadyScanned) {

            return res.json({

                success: false,
                message: "Student already scanned today."

            });

        }

        let status = "Present";

        if (
            now.getHours() > 7 ||
            (now.getHours() == 7 && now.getMinutes() > 30)
        ) {

            status = "Late";

        }

        const attendance =
        new Attendance({

            studentId: student.studentId,
            name: student.name,
            grade: student.grade,
            section: student.section,
            rfid: student.rfid,
            status,
            date: today,
            time: now.toLocaleTimeString()

        });

        await attendance.save();

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

    }

    catch(err){

        res.status(500).json({

            success:false,
            message:err.message

        });

    }

});

// ==========================================
// Dashboard API
// ==========================================

app.get("/dashboard", async (req, res) => {

    try {

        const totalStudents = await Student.countDocuments();

        const today = new Date().toLocaleDateString();

        const attendanceToday = await Attendance.find({
            date: today
        });

        const present = attendanceToday.filter(
            a => a.status === "Present"
        ).length;

        const late = attendanceToday.filter(
            a => a.status === "Late"
        ).length;

        const absent = Math.max(
            totalStudents - present - late,
            0
        );

        const attendanceRate =
            totalStudents > 0
            ? (((present + late) / totalStudents) * 100).toFixed(1)
            : 0;

        res.json({

            totalStudents,
            present,
            late,
            absent,
            attendanceRate

        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ==========================================
// AI Analytics
// ==========================================

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

        const absent = students - present - late;

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
            message: err.message
        });

    }

});

// ==========================================
// Reports
// ==========================================

app.get("/reports", async (req, res) => {

    try {

        const reports = await Attendance.find()
        .sort({
            _id: -1
        });

        res.json(reports);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ==========================================
// Notifications
// ==========================================

app.get("/notifications", async (req, res) => {

    const notifications =
    await Notification.find()
    .sort({
        _id: -1
    });

    res.json(notifications);

});

app.put("/notifications/:id", async (req, res) => {

    await Notification.findByIdAndUpdate(

        req.params.id,

        {
            read: true
        }

    );

    res.json({
        success: true
    });

});

// ==========================================
// Settings
// ==========================================

app.get("/settings", async (req, res) => {

    let settings =
    await Setting.findOne();

    if (!settings) {

        settings =
        await Setting.create({});

    }

    res.json(settings);

});

app.put("/settings", async (req, res) => {

    let settings =
    await Setting.findOne();

    if (!settings) {

        settings =
        new Setting(req.body);

    }

    else {

        Object.assign(
            settings,
            req.body
        );

    }

    await settings.save();

    res.json({

        success: true,

        settings

    });

});

// ==========================================
// System Logs
// ==========================================

app.get("/systemlogs", async (req, res) => {

    const logs =
    await SystemLog.find()
    .sort({
        _id: -1
    });

    res.json(logs);

});

app.delete("/systemlogs", async (req, res) => {

    await SystemLog.deleteMany({});

    res.json({

        success: true

    });

});

// ==========================================
// Server
// ==========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");
    console.log("=======================================");
    console.log(" AttendTrack Server Running");
    console.log(" http://localhost:3000");
    console.log("=======================================");
    console.log("");

});

