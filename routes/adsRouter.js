const express = require("express");
const authurization = require("../middlewares/authorization");
const { addAds, getAds } = require("../controllers/adsController");
const router = express.Router();

router.post("/add", authurization, addAds);
router.get("/", getAds);

module.exports = router;
