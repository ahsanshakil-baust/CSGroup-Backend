const ExperienceModel = require("../models/experienceModel");
const PortfolioModel = require("../models/portfolioModel");
const EducationModel = require("../models/educationModel");

const addPortfolio = (req, res, next) => {
    const { name, profession, url, email, phone, about } = req.body;
    if (name == "" || url == "" || about == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const portfolio = new PortfolioModel(
            name,
            profession,
            url,
            email,
            phone,
            about
        );
        portfolio.save((id) => {
            res.status(201).json({
                id,
            });
        });
    }
};

const updatePortfolio = (req, res, next) => {
    const { id, name, profession, url, email, phone, about } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const portfolio = new PortfolioModel(
            name,
            profession,
            url,
            email,
            phone,
            about
        );
        portfolio.id = id;
        portfolio.save((id) => {
            res.status(201).json({
                id,
            });
        });
    }
};

const getAllPortfolio = (req, res, next) => {
    PortfolioModel.getAllPortfolio((data) => {
        const newDate = data.filter((el) => el.status != 0);

        res.status(200).json({
            data: newDate,
        });
    });
};

const getPortfolio = async (req, res, next) => {
    const { id } = req.params;
    const convertedId = Number(id);

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const portfolio = await PortfolioModel.portfolioFindById(convertedId);
        if (!portfolio) {
            return res.status(404).json({ error: "Portfolio not found." });
        }

        // Fetch all dependent data in parallel with error handling
        const [experience, education] = await Promise.all([
            ExperienceModel.experienceFindById(id).catch((err) => {
                console.error("Experience fetch error:", err);
                return null;
            }),
            EducationModel.educationFindById(id).catch((err) => {
                console.error("Land details fetch error:", err);
                return null;
            }),
        ]);

        // Construct response
        const newData = {
            ...portfolio,
            experience_details: experience || {},
            education_details: education || {},
        };

        return res.status(200).json({ data: newData });
    }
};

const deletePortfolio = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const portfolio = new PortfolioModel();
        portfolio.id = id;
        portfolio.status = 0;
        portfolio.save(() =>
            res.status(201).json({
                msg: "Portfolio deleted successfully!",
            })
        );
    }
};

module.exports = {
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
    getAllPortfolio,
    getPortfolio,
};
