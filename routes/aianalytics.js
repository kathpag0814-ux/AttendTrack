const express = require("express");
const router = express.Router();

const Student = require("../models/students");
const Attendance = require("../models/attendance");

router.get("/", async (req, res) => {

    const totalStudents = await Student.countDocuments();

    const attendance = await Attendance.find();

    const present = attendance.filter(

        a => a.status == "Present"

    ).length;

    const late = attendance.filter(

        a => a.status == "Late"

    ).length;

    const absent = totalStudents - present - late;

    const score = totalStudents > 0

        ? Math.round(

            ((present + late) / totalStudents) * 100

        )

        : 0;

    res.json({

        totalStudents,

        present,

        late,

        absent,

        score

    });

});

module.exports = router;