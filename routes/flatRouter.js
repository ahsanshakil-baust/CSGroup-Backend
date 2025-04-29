const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addFlat,
    updateFlat,
    deleteFlat,
    getAllFlatsByProject,
} = require("../controllers/adminFlatController");
const router = express.Router();

router.post("/add", authurization, addFlat);
router.post("/update", authurization, updateFlat);
router.post("/delete", authurization, deleteFlat);
router.get("/flat/all-by-project", authurization, getAllFlatsByProject);

module.exports = router;
