const TeamMemberModel = require("../models/teamMemberModel");

const addTeamMember = (req, res, next) => {
  const { name, url, designation, info, fb, likdn, twt, type } = req.body;
  if (name == "" || url == "" || info == "" || type == "") {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const team = new TeamMemberModel(
      name,
      url,
      designation,
      info,
      fb,
      likdn,
      twt,
      type
    );

    team.save();

    res.status(201).json({
      msg: "Team Member added successfully!",
    });
  }
};

const updateTeamMember = (req, res, next) => {
  const { id, name, url, designation, info, fb, likdn, twt, type } = req.body;

  if (!id) {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const team = new TeamMemberModel(
      name,
      url,
      designation,
      info,
      fb,
      likdn,
      twt,
      type
    );
    team.id = id;
    team.save();
    res.status(201).json({
      msg: "Team Member updated successfully!",
    });
  }
};

const getAllTeamMember = (req, res, next) => {
  TeamMemberModel.getAllTeamMember((data) => {
    const newDate = data.filter((el) => el.status != 0);

    res.status(200).json({
      data: newDate,
    });
  });
};

const getTeamMember = (req, res, next) => {
  const { id } = req.params;
  const convertedId = Number(id);

  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    TeamMemberModel.teamMemberFindById(convertedId, (data) => {
      res.status(200).json({ data });
    });
  }
};

const deleteTeamMember = (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    // const info = new TeamMemberModel();
    // info.id = id;
    // info.status = 0;
    // info.save();
    TeamMemberModel.deleteById(id);
    res.status(201).json({
      msg: "Team Member deleted successfully!",
    });
  }
};

module.exports = {
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getAllTeamMember,
  getTeamMember,
};
