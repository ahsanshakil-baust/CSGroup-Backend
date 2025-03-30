const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addNotice,
    updateNotice,
    getNotice,
    deleteNotice,
} = require("../controllers/adminNoticeController");

const router = express.Router();

router.post("/add", authurization, addNotice);
router.post("/update", authurization, updateNotice);
router.get("/:id", authurization, getNotice);
router.post("/delete", authurization, deleteNotice);

module.exports = router;
