const express = require("express");
const router = express.Router();

const Student = require("../models/students");

// ===========================
// GET ALL STUDENTS
// ===========================

router.get("/", async (req, res) => {

    try {

        const students = await Student.find().sort({
            name: 1
        });

        res.json(students);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

});

// ===========================
// ADD STUDENT
// ===========================

router.post("/", async (req, res) => {

    try {

        const student = new Student(req.body);

        await student.save();

        res.json({

            success: true,

            student

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
// UPDATE STUDENT
// ===========================

router.put("/:id", async (req, res) => {

    try {

        const student =
        await Student.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        res.json(student);

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

// ===========================
// DELETE STUDENT
// ===========================

router.delete("/:id", async (req, res) => {

    try {

        await Student.findByIdAndDelete(

            req.params.id

        );

        res.json({

            success: true

        });

    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;