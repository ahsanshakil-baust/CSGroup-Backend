const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addOwner,
    updateOwner,
    deleteOwner,
    getOwner,
    getAllOwner,
} = require("../controllers/adminOwnerController");
const router = express.Router();

router.post("/add", authurization, addOwner);
router.post("/update", authurization, updateOwner);
router.post("/delete", authurization, deleteOwner);
router.get("/all", getAllOwner);
router.get("/:id", getOwner);

module.exports = router;
