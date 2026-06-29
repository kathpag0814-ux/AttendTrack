const express = require("express");
const router = express.Router();

const SystemLog = require("../models/systemlogs");

// ======================================
// GET ALL SYSTEM LOGS
// ======================================

router.get("/", async (req, res) => {

    try {

        const logs = await SystemLog.find()
            .sort({ createdAt: -1 });

        res.json(logs);

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ======================================
// ADD SYSTEM LOG
// ======================================

router.post("/", async (req, res) => {

    try {

        const log = new SystemLog({

            activity: req.body.activity,

            description: req.body.description,

            user: req.body.user || "Administrator",

            status: req.body.status || "Success"

        });

        await log.save();

        res.json({

            success: true,

            log

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ======================================
// DELETE ONE LOG
// ======================================

router.delete("/:id", async (req, res) => {

    try {

        await SystemLog.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "System log deleted."

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ======================================
// DELETE ALL LOGS
// ======================================

router.delete("/", async (req, res) => {

    try {

        await SystemLog.deleteMany({});

        res.json({

            success: true,

            message: "All system logs cleared."

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