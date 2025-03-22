const express = require("express");
const router = express.Router();

const {
    addSlider,
    updateSlider,
    deleteSlider,
    addSliderText,
    getSliderDetails,
    addSliderTextBn,
} = require("../controllers/adminHomeSliderController");
const authurization = require("../middlewares/authorization");

router.get("/slider-details", authurization, getSliderDetails);
router.post("/add-slider", authurization, addSlider);
router.post("/update-slider", authurization, updateSlider);
router.post("/delete-slider", authurization, deleteSlider);

router.post("/add-slider-text", authurization, addSliderText);
router.post("/add-slider-text-bn", authurization, addSliderTextBn);

module.exports = router;
