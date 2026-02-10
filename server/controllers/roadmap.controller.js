const Roadmap = require("../models/Roadmap");
const { generateRoadmap } = require("../services/ai.service");

exports.createRoadmap = async (req, res) => {
  try {
    const { skill, subSkills, level, timeline } = req.body;

    // 1. Check if roadmap already exists
    const existingRoadmap = await Roadmap.findOne({
      userId: req.user.id,
      skill,
      level,
    });

    if (existingRoadmap) {
      console.log("Returning existing roadmap for:", skill);
      return res.json(existingRoadmap);
    }

    // 2. If not, generate new one
    const generated = await generateRoadmap({
      skill,
      subSkills,
      level,
      timeline,
    });

    // Handle legacy/fallback if AI returns just array (though we updated prompts)
    const roadmapData = Array.isArray(generated) ? generated : generated.roadmap;
    const isCoding = generated.isCoding !== undefined ? generated.isCoding : true;

    const roadmap = await Roadmap.create({
      userId: req.user.id,
      skill,
      level,
      subSkills,
      weeklyPlan: roadmapData,
      isCoding,
      createdByAI: true,
    });

    res.json(roadmap);
  } catch (err) {
    console.error("❌ ROADMAP GENERATION ERROR:");
    console.error(err);
    console.error("STACK:", err.stack);

    res.status(500).json({
      msg: "Roadmap generation failed",
      error: err.message,
    });
  }
};

/* ✅ ADD THIS EXPORT (THIS WAS MISSING) */
exports.getMyRoadmap = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch roadmap" });
  }
};
