const express = require("express");
const router = express.Router();

const {
    getSliderText,
    getAllSliderDetails,
    getSliderTextBn,
} = require("../controllers/adminHomeSliderController");
const {
    getFlatDetails,
    getAllFlats,
} = require("../controllers/adminFlatController");
const {
    getAllProject,
    getProject,
} = require("../controllers/adminProjectController");

router.get("/slider-text", getSliderText);
router.get("/slider-text-bn", getSliderTextBn);
router.get("/sliders", getAllSliderDetails);
router.get("/flat/all", getAllFlats);
router.get("/flat", getFlatDetails);
router.get("/project/all", getAllProject);
router.get("/project/:id", getProject);

module.exports = router;
