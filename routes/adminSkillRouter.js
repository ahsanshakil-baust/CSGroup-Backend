const express = require("express");
const authurization = require("../middlewares/authorization");
const {
  addSkill,
  updateSkill,
  getSkill,
  deleteSkill,
} = require("../controllers/adminSkillsController");

const router = express.Router();

router.post("/add", authurization, addSkill);
router.post("/update", authurization, updateSkill);
router.get("/:id", authurization, getSkill);
router.post("/delete", authurization, deleteSkill);

module.exports = router;
