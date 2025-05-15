const express = require("express");
const {
  getAllUser,
  getUserByEmail,
  addUser,
  userLogin,
  checkLogin,
  changePassword,
  getToken,
} = require("../controllers/adminUserController");
const authurization = require("../middlewares/authorization");
const router = express.Router();

router.get("/all-user", authurization, getAllUser);
router.post("/register", addUser);
router.post("/login", userLogin);
router.post("/get-token", getToken);
router.get("/user", authurization, getUserByEmail);
router.get("/check", authurization, checkLogin);
router.post("/user/change-password", authurization, changePassword);

module.exports = router;
