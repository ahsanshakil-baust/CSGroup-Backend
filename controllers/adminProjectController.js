const ProjectModel = require("../models/projectModel");

const getAllProject = (req, res, next) => {
    ProjectModel.getAllProjects((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getProject = (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        ProjectModel.projectFindById(parseInt(id), (data) => {
            const newData = data;
            res.status(200).json({ data: newData });
        });
    }
};

const addProject = (req, res, next) => {
    const {
        name,
        project_type,
        location,
        description,
        land_videos,
        project_images,
        map_url,
    } = req.body;
    if (name == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const project = new ProjectModel(
            name,
            project_type,
            location,
            description,
            land_videos,
            project_images,
            map_url
        );
        project.save();

        res.status(201).json({
            msg: "Project added successfully!",
        });
    }
};

const updateProject = (req, res, next) => {
    const {
        id,
        name,
        project_type,
        location,
        description,
        land_videos,
        project_images,
        map_url,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const project = new ProjectModel(
            name,
            project_type,
            location,
            description,
            land_videos,
            project_images,
            map_url
        );
        project.id = id;
        project.save();
        res.status(201).json({
            msg: "Project updated successfully!",
        });
    }
};

const deleteProject = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const project = new ProjectModel();
        project.id = id;
        project.status = 0;
        project.save();
        res.status(201).json({
            msg: "Project deleted successfully!",
        });
    }
};

module.exports = {
    getAllProject,
    getProject,
    addProject,
    updateProject,
    deleteProject,
};
