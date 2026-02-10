const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const {
    markCompleted,
    getProgress,
} = require("../controllers/progress.controller");

router.post("/complete", auth, markCompleted);
router.get("/:roadmapId", auth, getProgress);

module.exports = router;
