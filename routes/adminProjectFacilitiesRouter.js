const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addProjectFacilities,
    updateProjectFacilities,
    deleteProjectFacilities,
    getAllProjectFacilities,
    getProjectFacilities,
} = require("../controllers/adminProjectFacilitiesController");

const router = express.Router();

router.post("/add", authurization, addProjectFacilities);
router.post("/update", authurization, updateProjectFacilities);
router.post("/delete", authurization, deleteProjectFacilities);
router.get("/all", getAllProjectFacilities);
router.get("/", getProjectFacilities);

module.exports = router;
