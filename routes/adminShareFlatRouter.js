const express = require("express");
const authurization = require("../middlewares/authorization");

const {
    updateShareFlat,
    addShareFlat,
    deleteShareFlat,
    getAllShareFlat,
    getShareFlat,
} = require("../controllers/adminShareFlatController");

const router = express.Router();

router.post("/add", authurization, addShareFlat);
router.post("/update", authurization, updateShareFlat);
router.post("/delete", authurization, deleteShareFlat);
router.get("/all", getAllShareFlat);
router.get("/:id", getShareFlat);

module.exports = router;
