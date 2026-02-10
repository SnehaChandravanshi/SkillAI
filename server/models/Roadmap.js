const mongoose = require("mongoose");

const RoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    skill: {
      type: String, // Store the main skill (e.g., "React")
      required: true,
    },
    level: {
      type: String, // Store the level (e.g., "Beginner")
      required: true,
    },
    subSkills: {
      type: [String], // Store sub-skills
    },
    weeklyPlan: {
      type: Array, // 🔴 important (AI output is dynamic)
      required: true,
    },
    createdByAI: {
      type: Boolean,
      default: true,
    },
    isCoding: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", RoadmapSchema);
