const SkillModel = require("../models/skillModel");

const addSkill = (req, res, next) => {
  const { title, portfolio_id } = req.body;
  if (title == "" || !portfolio_id) {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const skill = new SkillModel(title, portfolio_id);
    skill.save();

    res.status(201).json({
      msg: "Skill added successfully!",
    });
  }
};

const updateSkill = (req, res, next) => {
  const { id, title, portfolio_id } = req.body;

  if (!id || !title || !portfolio_id) {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const skill = new SkillModel(title, portfolio_id);
    skill.id = id;
    skill.save();
    res.status(201).json({
      msg: "Skill updated successfully!",
    });
  }
};

const getAllSkill = (req, res, next) => {
  SkillModel.getAllSkills((data) => {
    const newData = data.filter((el) => el.status != 0);

    console.log(newData);

    res.status(200).json({
      data: newData,
    });
  });
};

const getSkill = async (req, res, next) => {
  const { id } = req.params;
  const convertedId = Number(id);

  console.log(convertedId);

  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    const data = await SkillModel.skillFindById(convertedId);
    console.log(data);

    const filterData = data.filter((el) => el.status != 0);

    res.status(200).json({ data: filterData });
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
