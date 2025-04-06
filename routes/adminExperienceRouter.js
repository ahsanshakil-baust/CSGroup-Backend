const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addExperience,
    updateExperience,
    getExperience,
    deleteExperience,
    getExperienceById,
} = require("../controllers/adminExperienceController");

const router = express.Router();

router.post("/add", authurization, addExperience);
router.post("/update", authurization, updateExperience);
router.get("/:id", authurization, getExperience);
router.post("/delete", authurization, deleteExperience);
router.get("/one/:id", authurization, getExperienceById);

module.exports = router;
