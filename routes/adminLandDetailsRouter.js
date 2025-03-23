const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addLandDetails,
    updateLandDetails,
    deleteLandDetails,
    getAllLandDetails,
    getLandDetails,
} = require("../controllers/adminLandDetailsController");
const router = express.Router();

router.post("/add", authurization, addLandDetails);
router.post("/update", authurization, updateLandDetails);
router.post("/delete", authurization, deleteLandDetails);
router.get("/all", getAllLandDetails);
router.get("/", getLandDetails);

module.exports = router;
