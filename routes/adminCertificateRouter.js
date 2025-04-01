const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addCertificate,
    updateCertificate,
    getCertificate,
    deleteCertificate,
} = require("../controllers/adminCertificateController");

const router = express.Router();

router.post("/add", authurization, addCertificate);
router.post("/update", authurization, updateCertificate);
router.get("/:id", authurization, getCertificate);
router.post("/delete", authurization, deleteCertificate);

module.exports = router;
