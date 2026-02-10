const mongoose = require("mongoose");

const AssessmentSchema = new mongoose.Schema(
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
        questions: [
            {
                question: String,
                options: [String],
                correctAnswer: Number, // index of option
            },
        ],
        score: {
            type: Number,
            default: 0,
        },
        attempted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Assessment", AssessmentSchema);
