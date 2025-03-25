const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addProjectOverview,
    updateProjectOverview,
    deleteProjectOverview,
    getAllProjectOverview,
    getProjectOverview,
} = require("../controllers/adminProjectOverviewController");

const router = express.Router();

router.post("/add", authurization, addProjectOverview);
router.post("/update", authurization, updateProjectOverview);
router.post("/delete", authurization, deleteProjectOverview);
router.get("/all", getAllProjectOverview);
router.get("/", getProjectOverview);

module.exports = router;
