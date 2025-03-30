const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addEvent,
    updateEvent,
    getEvent,
    deleteEvent,
} = require("../controllers/adminEventController");

const router = express.Router();

router.post("/add", authurization, addEvent);
router.post("/update", authurization, updateEvent);
router.get("/:id", authurization, getEvent);
router.post("/delete", authurization, deleteEvent);

module.exports = router;
