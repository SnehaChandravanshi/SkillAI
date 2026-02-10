const Assessment = require("../models/Assessment");
const { generateQuiz } = require("../services/ai.service");

const Module = require("../models/Module");

exports.generateAssessment = async (req, res) => {
  const { moduleId } = req.body;

  try {
    // 1. Check if assessment already exists
    let assessment = await Assessment.findOne({
      userId: req.user.id,
      moduleId,
    });

    if (assessment) {
      return res.json(assessment);
    }

    // 2. Fetch Module details for context
    const moduleData = await Module.findById(moduleId);
    if (!moduleData) {
      return res.status(404).json({ msg: "Module not found" });
    }

    // 3. Generate Quiz
    const questions = await generateQuiz(moduleData.title, "beginner");

    assessment = await Assessment.create({
      userId: req.user.id,
      moduleId,
      questions,
    });

    res.json(assessment);
  } catch (err) {
    console.error("Quiz Gen Error:", err);
    res.status(500).json({ msg: "Failed to generate quiz" });
  }
};

exports.submitAssessment = async (req, res) => {
  const { assessmentId, answers } = req.body;

  const assessment = await Assessment.findById(assessmentId);

  let score = 0;
  assessment.questions.forEach((q, i) => {
    if (answers[i] === q.correctAnswer) score++;
  });

  assessment.score = score;
  assessment.attempted = true;
  await assessment.save();

  res.json({
    score,
    total: assessment.questions.length,
  });
};
