const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addProjectLandDetails,
    updateProjectLandDetails,
    deleteProjectLandDetails,
    getAllProjectLandDetails,
    getProjectLandDetails,
} = require("../controllers/adminProjectLandDetailsController");

const router = express.Router();

router.post("/add", authurization, addProjectLandDetails);
router.post("/update", authurization, updateProjectLandDetails);
router.post("/delete", authurization, deleteProjectLandDetails);
router.get("/all", getAllProjectLandDetails);
router.get("/:id", getProjectLandDetails);

module.exports = router;
