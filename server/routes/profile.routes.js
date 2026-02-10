const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { getProfileStats } = require("../controllers/profile.controller");

router.get("/stats", auth, getProfileStats);

module.exports = router;
