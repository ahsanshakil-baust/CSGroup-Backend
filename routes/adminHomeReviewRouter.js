const express = require("express");
const authurization = require("../middlewares/authorization");
const {
  addClientReview,
  updateReview,
  getAllReviews,
  getReview,
  deleteReview,
} = require("../controllers/adminHomeReviewController");

const router = express.Router();

router.post("/add", authurization, addClientReview);
router.post("/update", authurization, updateReview);
router.get("/get-all", getAllReviews);
router.get("/get-one", authurization, getReview);
router.post("/delete", authurization, deleteReview);

module.exports = router;
