const express = require("express");
const authurization = require("../middlewares/authorization");
const {
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
} = require("../controllers/adminPortfolioController");

const router = express.Router();

router.post("/add", authurization, addPortfolio);
router.post("/update", authurization, updatePortfolio);
router.post("/delete", authurization, deletePortfolio);

module.exports = router;
