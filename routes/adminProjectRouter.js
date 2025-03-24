const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addProject,
    updateProject,
    deleteProject,
} = require("../controllers/adminProjectController");
const router = express.Router();

router.post("/add", authurization, addProject);
router.post("/update", authurization, updateProject);
router.post("/delete", authurization, deleteProject);

module.exports = router;
