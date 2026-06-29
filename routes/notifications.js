const express = require("express");
const router = express.Router();

const Notification = require("../models/notifications");

// ======================================
// GET ALL NOTIFICATIONS
// ======================================

router.get("/", async (req, res) => {

    try {

        const notifications = await Notification.find()
            .sort({ createdAt: -1 });

        res.json(notifications);

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

// ======================================
// ADD NOTIFICATION
// ======================================

router.post("/", async (req, res) => {

    try {

        const notification = new Notification({

            title: req.body.title,
            message: req.body.message,
            type: req.body.type || "system",
            read: false

        });

        await notification.save();

        res.json({

            success: true,
            notification

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
// MARK ONE AS READ
// ======================================

router.put("/:id", async (req, res) => {

    try {

        const notification = await Notification.findByIdAndUpdate(

            req.params.id,

            {
                read: true
            },

            {
                new: true
            }

        );

        res.json({

            success: true,
            notification

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
// MARK ALL AS READ
// ======================================

router.put("/mark/all", async (req, res) => {

    try {

        await Notification.updateMany(
            {},
            {
                read: true
            }
        );

        res.json({

            success: true,

            message: "All notifications marked as read."

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
// DELETE ONE NOTIFICATION
// ======================================

router.delete("/:id", async (req, res) => {

    try {

        await Notification.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Notification deleted successfully."

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
// DELETE ALL NOTIFICATIONS
// ======================================

router.delete("/", async (req, res) => {

    try {

        await Notification.deleteMany({});

        res.json({

            success: true,

            message: "All notifications deleted."

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