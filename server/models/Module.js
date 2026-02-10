const mongoose = require("mongoose");

const ModuleSchema = new mongoose.Schema(
  {
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    level: String,
    content: {
      explanation: {
        definition: String,
        keyCharacteristics: [String],
        useCases: [String],
      },
      codeExamples: [
        {
          title: String,
          code: String,
        },
      ],
      commonMistakes: [String],
      practiceTasks: [
        {
          title: String,
          description: String,
          code: String, // Optional starter code
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Module", ModuleSchema);
