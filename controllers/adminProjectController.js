const ProjectModel = require("../models/projectModel");

const getAllProject = (req, res, next) => {
    ProjectModel.getAllProjects((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getProject = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        ProjectModel.projectFindById(id, (data) => {
            const newData = data.filter((el) => el.status != 0);
            res.status(200).json({ newData });
        });
    }
};

const addProject = (req, res, next) => {
    if (req.body.name == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const project = new ProjectModel(req.body.name);
        project.save();

        res.status(201).json({
            msg: "Project added successfully!",
        });
    }
};

const updateProject = (req, res, next) => {
    const { id, name } = req.body;

    if (!id || !name) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const project = new ProjectModel(name);
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
