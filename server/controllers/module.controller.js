const Module = require("../models/Module");
const { generateModule } = require("../services/ai.service");

exports.createModule = async (req, res) => {
  try {
    const { roadmapId, topic, level } = req.body;

    const content = await generateModule({ topic, level });

    const module = await Module.create({
      roadmapId,
      title: topic,
      level,
      content,
    });

    res.json(module);
  } catch (err) {
    console.error("MODULE ERROR:", err.message);
    res.status(500).json({ msg: "Module generation failed", error: err.message });
  }
};

exports.getModule = async (req, res) => {
  const module = await Module.findById(req.params.id).populate("roadmapId");
  res.json(module);
};
