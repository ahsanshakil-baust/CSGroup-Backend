const express = require("express");
const authurization = require("../middlewares/authorization");

const {
    addEducation,
    updateEducation,
    getEducation,
    deleteEducation,
    getEducationById,
} = require("../controllers/adminEducationController");

const router = express.Router();

router.post("/add", authurization, addEducation);
router.post("/update", authurization, updateEducation);
router.get("/:id", authurization, getEducation);
router.post("/delete", authurization, deleteEducation);
router.get("/one/:id", authurization, getEducationById);

module.exports = router;
