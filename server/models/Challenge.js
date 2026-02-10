const mongoose = require("mongoose");

const ChallengeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: true,
        },
        prompt: {
            title: String,
            description: String,
            example: String,
            constraints: String,
            input: String,
            output: String
        },
        solutionHint: String,
        userCode: String,
        aiFeedback: String,
        submitted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
