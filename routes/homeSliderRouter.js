const express = require("express");
const router = express.Router();

const {
  getAllSliderDetails,
  addSlider,
  updateSlider,
  deleteSlider,
  getSliderDetails,
} = require("../controllers/homeSliderController");

router.get("/", getAllSliderDetails);
router.get("/slider-details", getSliderDetails);
router.post("/add-slider", addSlider);
router.post("/update-slider", updateSlider);
router.post("/delete-slider", deleteSlider);

module.exports = router;
