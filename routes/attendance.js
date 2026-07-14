const express = require("express");

const router = express.Router();

const Attendance = require("../models/attendance");

router.get("/", async (req, res) => {

    try {

        const attendance = await Attendance.find().sort({ createdAt: -1 });

        res.json(attendance);

    }

    catch(err){

        res.status(500).json({

            message: err.message

        });

    }

});

module.exports = router;