const express = require("express");
const router = express.Router();
const {
  getSkills,
  createSkill,
} = require("../controllers/skill.controller");

router.get("/", getSkills);       // Public
router.post("/", createSkill);    // Admin / Seed

module.exports = router;
