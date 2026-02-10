const Challenge = require("../models/Challenge");
const Module = require("../models/Module");
const {
    generateCodingChallenge,
    reviewCode,
} = require("../services/ai.service");

exports.getChallenge = async (req, res) => {
    const { moduleId } = req.body;

    try {
        let challenge = await Challenge.findOne({
            userId: req.user.id,
            moduleId,
        });

        if (challenge) {
            return res.json(challenge);
        }

        const moduleData = await Module.findById(moduleId);
        if (!moduleData) {
            return res.status(404).json({ msg: "Module not found" });
        }

        const generated = await generateCodingChallenge(moduleData.title, "beginner");

        // Handle different AI response formats
        const promptData = generated.prompt || generated.problem;
        let hintData = generated.solutionHint;

        if (Array.isArray(hintData)) {
            hintData = hintData.join("\n");
        } else if (typeof hintData === 'object') {
            hintData = Object.values(hintData).join("\n");
        }

        challenge = await Challenge.create({
            userId: req.user.id,
            moduleId,
            prompt: promptData,
            solutionHint: hintData,
        });

        res.json(challenge);
    } catch (err) {
        console.error("Challenge Error:", err);
        require('fs').appendFileSync('challenge_errors.log', `${new Date().toISOString()} - ${err.message}\n${err.stack}\n\n`);
        res.status(500).json({ msg: "Failed to generate challenge" });
    }
};

exports.submitCode = async (req, res) => {
    const { challengeId, userCode } = req.body;

    const challenge = await Challenge.findById(challengeId);

    const feedback = await reviewCode(
        challenge.prompt,
        userCode
    );

    challenge.userCode = userCode;
    challenge.aiFeedback = feedback;
    challenge.submitted = true;
    await challenge.save();

    res.json(challenge);
};
