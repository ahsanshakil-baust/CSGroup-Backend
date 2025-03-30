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
const {
    getAllShares,
    getShare,
} = require("../controllers/adminShareController");
const { getAllNotice } = require("../controllers/adminNoticeController");
const {
    getAllEvent,
    getEventReels,
} = require("../controllers/adminEventController");

router.get("/slider-text", getSliderText);
router.get("/slider-text-bn", getSliderTextBn);
router.get("/sliders", getAllSliderDetails);
router.get("/flat/all", getAllFlats);
router.get("/flat/:id", getFlatDetails);
router.get("/project/all", getAllProject);
router.get("/project/:id", getProject);
router.get("/share/all", getAllShares);
router.get("/share/:id", getShare);
router.get("/notice/all", getAllNotice);
router.get("/event/all", getAllEvent);
router.get("/event/reels", getEventReels);

module.exports = router;
