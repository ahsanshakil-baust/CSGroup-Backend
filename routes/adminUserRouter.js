const express = require("express");
const {
    getAllUser,
    getUserByEmail,
    addUser,
    userLogin,
    checkLogin,
} = require("../controllers/adminUserController");
const authurization = require("../middlewares/authorization");
const router = express.Router();

router.get("/all-user", authurization, getAllUser);
router.post("/register", addUser);
router.post("/login", userLogin);
router.get("/user", authurization, getUserByEmail);
router.get("/check", authurization, checkLogin);

module.exports = router;
