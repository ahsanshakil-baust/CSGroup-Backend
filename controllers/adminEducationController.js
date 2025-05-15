const EducationModel = require("../models/educationModel");

const addEducation = (req, res, next) => {
    const {
        title,
        profession,
        institution,
        about,
        date_duration,
        portfolio_id,
    } = req.body;
    if (title == "" || profession == "" || about == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const education = new EducationModel(
            title,
            profession,
            institution,
            about,
            date_duration,
            portfolio_id
        );
        education.save();

        res.status(201).json({
            msg: "Education added successfully!",
        });
    }
};

const updateEducation = (req, res, next) => {
    const {
        id,
        title,
        profession,
        institution,
        about,
        date_duration,
        portfolio_id,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const education = new EducationModel(
            title,
            profession,
            institution,
            about,
            date_duration,
            portfolio_id
        );
        education.id = id;
        education.save();
        res.status(201).json({
            msg: "Education updated successfully!",
        });
    }
};

const getAllEducation = (req, res, next) => {
    EducationModel.getAllEducation((data) => {
        const newDate = data.filter((el) => el.status != 0);

        res.status(200).json({
            data: newDate,
        });
    });
};

const getEducation = async (req, res, next) => {
    const { id } = req.params;
    const convertedId = id;

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const data = await EducationModel.educationFindByPortfolioId(
            convertedId
        );
        const newDate = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newDate });
    }
};

const getEducationById = async (req, res, next) => {
    const { id } = req.params;
    const convertedId = id;

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const response = await EducationModel.educationById(convertedId);
        res.status(200).json({ data: response });
    }
};

const deleteEducation = async (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        // const education = new EducationModel();
        // education.id = id;
        // education.status = 0;
        // education.save();
        await EducationModel.deleteById(id);
        res.status(201).json({
            msg: "Education deleted successfully!",
        });
    }
};

module.exports = {
    addEducation,
    updateEducation,
    deleteEducation,
    getAllEducation,
    getEducation,
    getEducationById,
};
