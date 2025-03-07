const express = require("express");
const router = express.Router();

const {
  getAllSliderDetails,
  addSlider,
  updateSlider,
  deleteSlider,
  getSliderDetails,
  addSliderText,
} = require("../controllers/homeSliderController");
const { getSliderText } = require("../models/homeSliderTextModel");

router.get("/sliders", getAllSliderDetails);
router.get("/slider-details", getSliderDetails);
router.post("/add-slider", addSlider);
router.post("/update-slider", updateSlider);
router.post("/delete-slider", deleteSlider);

router.get("/slider-text", getSliderText);
router.post("/add-slider-text", addSliderText);

module.exports = router;
