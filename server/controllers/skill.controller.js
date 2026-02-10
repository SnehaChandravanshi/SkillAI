const Skill = require("../models/Skill");

/* GET ALL SKILLS */
exports.getSkills = async (req, res) => {
  const skills = await Skill.find();
  res.json(skills);
};

/* CREATE SKILL (ADMIN / SEED) */
exports.createSkill = async (req, res) => {
  const { name, description, subSkills } = req.body;

  const skill = await Skill.create({
    name,
    description,
    subSkills,
  });

  res.json(skill);
};
