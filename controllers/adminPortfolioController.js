const ExperienceModel = require("../models/experienceModel");
const PortfolioModel = require("../models/portfolioModel");
const EducationModel = require("../models/educationModel");
const TeamMemberModel = require("../models/teamMemberModel");

const addPortfolio = (req, res, next) => {
    const { member_id, profession, url, email, phone, about } = req.body;
    if (member_id == "" || url == "" || about == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const portfolio = new PortfolioModel(
            member_id,
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
    const { id, member_id, profession, url, email, phone, about } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const portfolio = new PortfolioModel(
            member_id,
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

const getAllPortfolio = async (req, res, next) => {
    // PortfolioModel.getAllPortfolio((data) => {
    //     const newDate = data.filter((el) => el.status != 0);

    //     res.status(200).json({
    //         data: newDate,
    //     });
    // });

    const portfolio = await new Promise((resolve, reject) => {
        PortfolioModel.getAllPortfolio((portfolio) => {
            if (!portfolio) return reject(new Error("No portfolio found"));
            resolve(portfolio);
        });
    });

    const filteredPortfolio = portfolio.filter((el) => el.status !== 0);

    const memberDetailsPromises = filteredPortfolio.map(async (el) => {
        const [member] = await Promise.all([
            TeamMemberModel.teamMemberById(parseInt(el?.member_id)),
        ]);

        return {
            ...el,
            ...member,
        };
    });

    const updateData = await Promise.all(memberDetailsPromises);
    res.status(200).json({ data: updateData });
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
        const [experience, education, member] = await Promise.all([
            ExperienceModel.experienceFindById(id).catch((err) => {
                console.error("Experience fetch error:", err);
                return null;
            }),
            EducationModel.educationFindById(id).catch((err) => {
                console.error("Land details fetch error:", err);
                return null;
            }),
            TeamMemberModel.teamMemberById(parseInt(portfolio?.member_id)),
        ]);

        const filterExperience = experience.filter((el) => el?.status != 0);
        const filterEducation = education.filter((el) => el?.status != 0);

        // Construct response
        const newData = {
            ...portfolio,
            ...member,
            experience_details: filterExperience || {},
            education_details: filterEducation || {},
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
