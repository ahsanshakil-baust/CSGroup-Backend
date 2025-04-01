const express = require("express");
const authurization = require("../middlewares/authorization");
const { addContact } = require("../controllers/adminContactController");

const router = express.Router();

router.post("/add", authurization, addContact);

module.exports = router;
