const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["learner", "admin"], default: "learner" },
  primarySkill: String,
  experienceLevel: String,
  targetTimeline: Number,
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
