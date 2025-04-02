const PortfolioModel = require("../models/portfolioModel");

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
        portfolio.save();

        res.status(201).json({
            msg: "Portfolio added successfully!",
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
        portfolio.save();
        res.status(201).json({
            msg: "Portfolio updated successfully!",
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

const getPortfolio = (req, res, next) => {
    const { id } = req.params;
    const convertedId = Number(id);

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        PortfolioModel.portfolioFindById(convertedId, (data) => {
            res.status(200).json({ data });
        });
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
        portfolio.save();
        res.status(201).json({
            msg: "Portfolio deleted successfully!",
        });
    }
};

module.exports = {
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
    getAllPortfolio,
    getPortfolio,
};
