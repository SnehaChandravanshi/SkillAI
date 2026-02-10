const User = require("../models/User");
const Challenge = require("../models/Challenge");
const Assessment = require("../models/Assessment");
const Progress = require("../models/Progress");

exports.getProfileStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Basic User Info
        const user = await User.findById(userId).select("-password");

        // 2. Problems Solved (Challenges)
        const problemsSolved = await Challenge.countDocuments({
            userId,
            submitted: true,
        });

        // 3. Accuracy (Assessments)
        const assessments = await Assessment.find({ userId });
        let totalAccuracy = 0;
        if (assessments.length > 0) {
            const totalScore = assessments.reduce((acc, curr) => {
                // Calculate percentage for each assessment
                const percentage = (curr.score / curr.questions.length) * 100;
                return acc + percentage;
            }, 0);
            totalAccuracy = Math.round(totalScore / assessments.length);
        }

        // 4. Streak (Progress)
        // We might have multiple progress records if multiple roadmaps, 
        // but usually streak is global or we pick the max/active one.
        // For now, let's take the max streak across all progress records or the most recent one.
        const progressDocs = await Progress.find({ userId });
        const streak = progressDocs.reduce((max, p) => (p.streak > max ? p.streak : max), 0);
        const totalModulesCompleted = progressDocs.reduce((sum, p) => sum + p.completedModules.length, 0);


        // 5. Activity Heatmap Data (Last 365 Days)
        // Aggregate timestamps from Challenges, Assessments, and Progress updates
        const activityMap = {};

        const addToMap = (date) => {
            const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
            activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
        };

        // Challenges
        const challenges = await Challenge.find({ userId, submitted: true }).select("createdAt");
        challenges.forEach(c => addToMap(c.createdAt));

        // Assessments
        assessments.forEach(a => addToMap(a.createdAt));

        // Progress (Use updatedAt as a proxy for activity)
        progressDocs.forEach(p => addToMap(p.updatedAt));

        // Convert map to array format for frontend
        const activityData = Object.entries(activityMap).map(([date, count]) => ({
            date,
            count
        }));

        res.json({
            user,
            stats: {
                problemsSolved,
                accuracy: totalAccuracy,
                streak,
                totalModulesCompleted
            },
            activity: activityData
        });

    } catch (err) {
        console.error("Profile Stats Error:", err);
        res.status(500).json({ msg: "Server Error" });
    }
};
