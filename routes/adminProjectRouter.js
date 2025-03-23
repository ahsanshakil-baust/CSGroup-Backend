const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addProject,
    updateProject,
    deleteProject,
    getProject,
    getAllProject,
} = require("../controllers/adminProjectController");
const router = express.Router();

router.post("/add", authurization, addProject);
router.post("/update", authurization, updateProject);
router.post("/delete", authurization, deleteProject);
router.get("/all", getAllProject);
router.get("/", getProject);

module.exports = router;
