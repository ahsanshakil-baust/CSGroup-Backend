const LandDetailsModel = require("../models/landDetailsModel");

const getAllLandDetails = (req, res, next) => {
    LandDetailsModel.getAllLandDetails((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getLandDetails = (req, res, next) => {
    const { id, project_id, flat_id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        LandDetailsModel.landFindById({ id, project_id, flat_id }, (data) => {
            const newData = data.filter((el) => el.status != 0);
            res.status(200).json({ newData });
        });
    }
};

const addLandDetails = (req, res, next) => {
    const {
        area,
        building_height,
        total_share,
        total_sqf,
        net_sqf,
        price,
        reg_cost,
        khariz_cost,
        other_cost,
        total_price,
        flat_id,
        project_id,
    } = req.body;

    if (!project_id && !flat_id && !area) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const landDetails = new LandDetailsModel(
            area,
            building_height,
            total_share,
            total_sqf,
            net_sqf,
            price,
            reg_cost,
            khariz_cost,
            other_cost,
            total_price,
            flat_id,
            project_id
        );

        landDetails.save();

        res.status(201).json({
            msg: "Land Details added successfully!",
        });
    }
};

const updateLandDetails = (req, res, next) => {
    const {
        id,
        area,
        building_height,
        total_share,
        total_sqf,
        net_sqf,
        price,
        reg_cost,
        khariz_cost,
        other_cost,
        total_price,
        flat_id,
        project_id,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const land = new LandDetailsModel(
            area,
            building_height,
            total_share,
            total_sqf,
            net_sqf,
            price,
            reg_cost,
            khariz_cost,
            other_cost,
            total_price,
            flat_id,
            project_id
        );
        land.id = id;
        land.save();
        res.status(201).json({
            msg: "Land Details updated successfully!",
        });
    }
};

const deleteLandDetails = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const land = new LandDetailsModel();
        land.id = id;
        land.status = 0;
        land.save();
        res.status(201).json({
            msg: "Land deleted successfully!",
        });
    }
};

module.exports = {
    getAllLandDetails,
    getLandDetails,
    addLandDetails,
    updateLandDetails,
    deleteLandDetails,
};
