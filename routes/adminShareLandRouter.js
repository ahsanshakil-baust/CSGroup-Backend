const express = require("express");
const authurization = require("../middlewares/authorization");

const {
    addShareLandDetails,
    updateShareLandDetails,
    deleteShareLandDetails,
    getAllShareLandDetails,
    getShareLandDetails,
} = require("../controllers/adminShareLandDetailsController");

const router = express.Router();

router.post("/add", authurization, addShareLandDetails);
router.post("/update", authurization, updateShareLandDetails);
router.post("/delete", authurization, deleteShareLandDetails);
router.get("/all", getAllShareLandDetails);
router.get("/:id", getShareLandDetails);

module.exports = router;
