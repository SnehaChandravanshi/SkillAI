require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/skills", require("./routes/skill.routes"));
app.use("/api/mentor", require("./routes/mentor.routes"));
app.use("/api/modules", require("./routes/module.routes"));
app.use("/api/assessment", require("./routes/assessment.routes"));
app.use("/api/roadmap", require("./routes/roadmap.routes"));
app.use("/api/progress", require("./routes/progress.routes"));
app.use("/api/certificate", require("./routes/certificate.routes"));
app.use("/api/challenge", require("./routes/challenge.routes"));
app.use("/api/profile", require("./routes/profile.routes"));

app.get("/", (req, res) => {
  res.json({ message: "SkillAI Backend Running 🚀" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
