const Progress = require("../models/Progress");

exports.markCompleted = async (req, res) => {
    const { roadmapId, moduleId } = req.body;

    let progress = await Progress.findOne({
        userId: req.user.id,
        roadmapId,
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!progress) {
        progress = await Progress.create({
            userId: req.user.id,
            roadmapId,
            completedModules: [moduleId],
            streak: 1,
            lastActive: today,
        });
    } else {
        const last = new Date(progress.lastActive);
        last.setHours(0, 0, 0, 0);

        const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            progress.streak += 1; // 🔥 streak continues
        } else if (diffDays > 1) {
            progress.streak = 1; // ❌ streak reset
        }

        // Check using comparison of strings to ensure no ObjectId mismatch
        const alreadyCompleted = progress.completedModules.some(
            (id) => id.toString() === moduleId
        );

        if (!alreadyCompleted) {
            progress.completedModules.push(moduleId);
        }

        progress.lastActive = today;
        await progress.save();
    }

    res.json(progress);
};


exports.getProgress = async (req, res) => {
    const progress = await Progress.findOne({
        userId: req.user.id,
        roadmapId: req.params.roadmapId,
    }).populate("completedModules"); // Populate to get titles for frontend matching

    res.json(progress || { completedModules: [] });
};
