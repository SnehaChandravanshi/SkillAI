const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  subSkills: [String],
});

module.exports = mongoose.model("Skill", SkillSchema);
