const express = require("express");
const authurization = require("../middlewares/authorization");
const { addAds, getAds, deleteAds } = require("../controllers/adsController");
const router = express.Router();

router.post("/add", authurization, addAds);
router.get("/", getAds);
router.post("/delete", deleteAds);

module.exports = router;
