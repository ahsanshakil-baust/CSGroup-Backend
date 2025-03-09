const express = require("express");
const router = express.Router();

const {
  getSliderText,
  getAllSliderDetails,
} = require("../controllers/adminHomeSliderController");

router.get("/slider-text", getSliderText);
router.get("/sliders", getAllSliderDetails);

module.exports = router;
