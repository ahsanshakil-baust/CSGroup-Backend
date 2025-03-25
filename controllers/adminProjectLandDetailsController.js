const ProjectLandDetailsModel = require("../models/projectLandDetailsModel");

const getAllProjectLandDetails = (req, res, next) => {
    ProjectLandDetailsModel.getAllProjectLand((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getProjectLandDetails = (req, res, next) => {
    const { id, project_id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        ProjectLandDetailsModel.projectLandFindById({ project_id }, (data) => {
            const newData = data.filter((el) => el.status != 0);
            res.status(200).json({ newData });
        });
    }
};

const addProjectLandDetails = (req, res, next) => {
    const { area, building_height, total_share, total_sqf, project_id } =
        req.body;

    if (!project_id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const landDetails = new ProjectLandDetailsModel(
            area,
            building_height,
            total_share,
            total_sqf,
            project_id
        );

        landDetails.save((data) => {
            res.status(201).json({
                data,
            });
        });
    }
};

const updateProjectLandDetails = (req, res, next) => {
    const { id, area, building_height, total_share, total_sqf, project_id } =
        req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const land = new ProjectLandDetailsModel(
            area,
            building_height,
            total_share,
            total_sqf,
            project_id
        );
        land.id = id;
        land.save();
        res.status(201).json({
            msg: "Land Details updated successfully!",
        });
    }
};

const deleteProjectLandDetails = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const land = new ProjectLandDetailsModel();
        land.id = id;
        land.status = 0;
        land.save();
        res.status(201).json({
            msg: "Land deleted successfully!",
        });
    }
};

module.exports = {
    getAllProjectLandDetails,
    getProjectLandDetails,
    addProjectLandDetails,
    updateProjectLandDetails,
    deleteProjectLandDetails,
};
