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

router.get("/slider-text", getSliderText);
router.get("/slider-text-bn", getSliderTextBn);
router.get("/sliders", getAllSliderDetails);
router.get("/all-flat", getAllFlats);
router.get("/flat", getFlatDetails);

module.exports = router;
