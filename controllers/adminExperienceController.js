const ExperienceModel = require("../models/experienceModel");

const addExperience = (req, res, next) => {
    const { title, profession, about, date_duration, Experience_id } = req.body;
    if (title == "" || profession == "" || about == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const experience = new ExperienceModel(
            title,
            profession,
            about,
            date_duration,
            Experience_id
        );
        experience.save();

        res.status(201).json({
            msg: "Experience added successfully!",
        });
    }
};

const updateExperience = (req, res, next) => {
    const { id, title, profession, about, date_duration, Experience_id } =
        req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const experience = new ExperienceModel(
            title,
            profession,
            about,
            date_duration,
            Experience_id
        );
        experience.id = id;
        experience.save();
        res.status(201).json({
            msg: "Experience updated successfully!",
        });
    }
};

const getAllExperience = (req, res, next) => {
    ExperienceModel.getAllExperience((data) => {
        const newDate = data.filter((el) => el.status != 0);

        res.status(200).json({
            data: newDate,
        });
    });
};

const getExperience = (req, res, next) => {
    const { id } = req.params;
    const convertedId = Number(id);

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        ExperienceModel.experienceFindById(convertedId, (data) => {
            res.status(200).json({ data });
        });
    }
};

const deleteExperience = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const experience = new ExperienceModel();
        experience.id = id;
        experience.status = 0;
        experience.save();
        res.status(201).json({
            msg: "Experience deleted successfully!",
        });
    }
};

module.exports = {
    addExperience,
    updateExperience,
    deleteExperience,
    getAllExperience,
    getExperience,
};
