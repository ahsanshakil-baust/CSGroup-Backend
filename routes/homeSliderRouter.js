const express = require("express");
const router = express.Router();

const {
  getAllSliderDetails,
  addSlider,
  updateSlider,
  deleteSlider,
  getSliderDetails,
  addSliderText,
  getSliderText,
} = require("../controllers/homeSliderController");
const authurization = require("../middlewares/authorization");

router.get("/sliders", authurization, getAllSliderDetails);
router.get("/slider-details", authurization, getSliderDetails);
router.post("/add-slider", authurization, addSlider);
router.post("/update-slider", authurization, updateSlider);
router.post("/delete-slider", authurization, deleteSlider);

router.get("/slider-text", authurization, getSliderText);
router.post("/add-slider-text", authurization, addSliderText);

module.exports = router;
