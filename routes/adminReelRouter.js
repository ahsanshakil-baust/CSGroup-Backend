const express = require("express");
const authurization = require("../middlewares/authorization");
const {
  addSkill,
  updateSkill,
  getSkill,
  deleteSkill,
} = require("../controllers/adminSkillsController");
const {
  addReel,
  updateReel,
  getReel,
  deleteReel,
} = require("../controllers/adminSliderReelsCOntroller");

const router = express.Router();

router.post("/add", authurization, addReel);
router.post("/update", authurization, updateReel);
router.get("/:id", authurization, getReel);
router.post("/delete", authurization, deleteReel);

module.exports = router;
