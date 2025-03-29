const HomeSliders = require("../models/homeSliderModel");
const HomeSlidersTextBn = require("../models/homeSliderTextBnModel");
const HomeSlidersText = require("../models/homeSliderTextModel");

const getAllSliderDetails = (req, res, next) => {
    HomeSliders.getAllSlider((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getSliderDetails = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        HomeSliders.sliderFindById(id, (data) => {
            const newData = data.filter((el) => el.status != 0);
            res.status(200).json({ newData });
        });
    }
};

const addSlider = (req, res, next) => {
    if (req.body.url == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const slider = new HomeSliders(req.body.url);
        slider.save();

        res.status(201).json({
            msg: "Slider added successfully!",
        });
    }
};

const updateSlider = (req, res, next) => {
    const { id, url } = req.body;

    if (!id || !url) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const slider = new HomeSliders(url);
        slider.id = id;
        slider.save();
        res.status(201).json({
            msg: "Slider updated successfully!",
        });
    }
};

const deleteSlider = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const slider = new HomeSliders();
        slider.id = id;
        slider.status = 0;
        slider.save();
        res.status(201).json({
            msg: "Slider deleted successfully!",
        });
    }
};

const getSliderText = (req, res, next) => {
    HomeSlidersText.getText((data) => {
        if (!data || typeof data.text === "undefined") {
            return res.status(404).json({ error: "No slider text found" });
        }
        res.status(200).json(data);
    });
};

const getSliderTextBn = (req, res, next) => {
    HomeSlidersTextBn.getText((data) => {
        if (!data || typeof data.text === "undefined") {
            return res.status(404).json({ error: "No slider text found" });
        }
        res.status(200).json(data);
    });
};

const addSliderText = (req, res, next) => {
    if (!req.body.text) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const slider = new HomeSlidersText(req.body.text);
        slider.save();

        res.status(201).json({
            msg: "Slider Text added successfully!",
        });
    }
};

const addSliderTextBn = (req, res, next) => {
    if (!req.body.text) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const slider = new HomeSlidersTextBn(req.body.text);
        slider.save();

        res.status(201).json({
            msg: "Slider Text added successfully!",
        });
    }
};

module.exports = {
    getAllSliderDetails,
    addSlider,
    updateSlider,
    deleteSlider,
    getSliderDetails,
    getSliderText,
    addSliderText,
    getSliderTextBn,
    addSliderTextBn,
};
