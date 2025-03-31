const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addMessage,
    updateMessage,
    getMessage,
    deleteMessage,
} = require("../controllers/adminMessageController");

const router = express.Router();

router.post("/add", authurization, addMessage);
router.post("/update", authurization, updateMessage);
router.get("/:id", authurization, getMessage);
router.post("/delete", authurization, deleteMessage);

module.exports = router;
