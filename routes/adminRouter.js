const express = require("express");
const {
  getAllUser,
  getUserByEmail,
  addUser,
  userLogin,
} = require("../controllers/adminController");
const authurization = require("../middlewares/authorization");
const router = express.Router();

router.get("/all-user", getAllUser);
router.post("/register", addUser);
router.post("/login", userLogin);
router.get("/user", authurization, getUserByEmail);

module.exports = router;
