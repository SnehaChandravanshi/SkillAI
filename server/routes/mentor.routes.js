const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { chatWithMentor } = require("../controllers/mentor.controller");

router.post("/chat", auth, chatWithMentor);

module.exports = router;
