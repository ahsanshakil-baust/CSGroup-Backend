const SkillModel = require("../models/skillModel");

const addSkill = (req, res, next) => {
  const { title } = req.body;
  if (title == "") {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const skill = new SkillModel(title);
    skill.save();

    res.status(201).json({
      msg: "Skill added successfully!",
    });
  }
};

const updateSkill = (req, res, next) => {
  const { id, title } = req.body;

  if (!id || !title) {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const skill = new SkillModel(title);
    skill.id = id;
    skill.save();
    res.status(201).json({
      msg: "Skill updated successfully!",
    });
  }
};

const getAllSkill = (req, res, next) => {
  SkillModel.getAllSkills((data) => {
    const newDate = data.filter((el) => el.status != 0);

    res.status(200).json({
      data: newDate,
    });
  });
};

const getSkill = (req, res, next) => {
  const { id } = req.params;
  const convertedId = Number(id);

  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    SkillModel.skillFindById(convertedId, (data) => {
      res.status(200).json({ data });
    });
  }
};

const deleteSkill = (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    const skill = new SkillModel();
    skill.id = id;
    skill.status = 0;
    skill.save();
    res.status(201).json({
      msg: "Skill deleted successfully!",
    });
  }
};

module.exports = {
  addSkill,
  updateSkill,
  deleteSkill,
  getAllSkill,
  getSkill,
};
