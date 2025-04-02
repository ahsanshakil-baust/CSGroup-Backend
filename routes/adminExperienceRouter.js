const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addExperience,
    updateExperience,
    getExperience,
    deleteExperience,
} = require("../controllers/adminExperienceController");

const router = express.Router();

router.post("/add", authurization, addExperience);
router.post("/update", authurization, updateExperience);
router.get("/:id", authurization, getExperience);
router.post("/delete", authurization, deleteExperience);

module.exports = router;
