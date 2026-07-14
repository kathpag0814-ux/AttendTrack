const express = require("express");
const router = express.Router();

const Student = require("../models/students");


// ================================
// GET ALL STUDENTS
// ================================

router.get("/", async (req, res) => {

    try {

        const students = await Student.find().sort({ _id: -1 });

        res.json(students);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});


// ================================
// ADD STUDENT
// ================================

router.post("/", async (req, res) => {

    try {

        const student = new Student({

            name: req.body.name,

            rfid: req.body.rfid,

            grade: req.body.grade,

            section: req.body.section,

            status: "Active"

        });

        await student.save();

        res.json({

            success: true,

            message: "Student Added Successfully",

            student

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});


// ================================
// DELETE STUDENT
// ================================

router.delete("/:id", async (req, res) => {

    try {

        await Student.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Student Deleted"

        });

    } catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;