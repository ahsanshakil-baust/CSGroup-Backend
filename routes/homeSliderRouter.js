const express = require("express");
const router = express.Router();

const {
  getAllSliderDetails,
  addSlider,
} = require("../controllers/homeSliderController");

router.get("/", getAllSliderDetails);
router.post("/add-slider", addSlider);

module.exports = router;
