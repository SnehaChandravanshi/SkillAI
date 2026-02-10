const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    generateAssessment,
    submitAssessment,
} = require("../controllers/assessment.controller");

router.post("/generate", auth, generateAssessment);
router.post("/submit", auth, submitAssessment);

module.exports = router;
