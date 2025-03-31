const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addTeamMember,
    updateTeamMember,
    getTeamMember,
    deleteTeamMember,
} = require("../controllers/adminTeamMemberController");

const router = express.Router();

router.post("/add", authurization, addTeamMember);
router.post("/update", authurization, updateTeamMember);
router.get("/:id", authurization, getTeamMember);
router.post("/delete", authurization, deleteTeamMember);

module.exports = router;
