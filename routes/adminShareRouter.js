const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addShare,
    updateShare,
    deleteShare,
} = require("../controllers/adminShareController");
const router = express.Router();

router.post("/add", authurization, addShare);
router.post("/update", authurization, updateShare);
router.post("/delete", authurization, deleteShare);

module.exports = router;
