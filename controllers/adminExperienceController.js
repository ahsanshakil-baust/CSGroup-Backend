const ExperienceModel = require("../models/experienceModel");

const addExperience = (req, res, next) => {
    const { title, profession, about, date_duration, portfolio_id } = req.body;
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
            portfolio_id
        );
        experience.save();

        res.status(201).json({
            msg: "Experience added successfully!",
        });
    }
};

const updateExperience = (req, res, next) => {
    const { id, title, profession, about, date_duration, portfolio_id } =
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
            portfolio_id
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

const getExperience = async (req, res, next) => {
    const { id } = req.params;
    const convertedId = id;

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const response = await ExperienceModel.experienceFindByPortfolioId(
            convertedId
        );
        const newDate = response.filter((el) => el.status != 0);
        res.status(200).json({ data: newDate });
    }
};

const getExperienceById = async (req, res, next) => {
    const { id } = req.params;
    const convertedId = id;

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const response = await ExperienceModel.experienceById(convertedId);
        res.status(200).json({ data: response });
    }
};

const deleteExperience = async (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        // const experience = new ExperienceModel();
        // experience.id = id;
        // experience.status = 0;
        // experience.save();
        await ExperienceModel.deleteById(id);
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
    getExperienceById,
};
