const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    getChallenge,
    submitCode,
} = require("../controllers/challenge.controller");

router.post("/get", auth, getChallenge);
router.post("/submit", auth, submitCode);

module.exports = router;
