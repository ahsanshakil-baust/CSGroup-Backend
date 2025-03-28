const FlatLandDetailsModel = require("../models/flatLandDetailsModel");

const getAllLandDetails = (req, res, next) => {
    FlatLandDetailsModel.getAllLandDetails((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getLandDetails = async (req, res, next) => {
    try {
        const { id, project_id } = req.body;
        if (!id) {
            return res.status(400).json({ error: "Need To Pass Id." });
        }

        // Fetch land details
        const landDetails = await FlatLandDetailsModel.landFindById(
            id,
            project_id
        );

        return res.status(200).json({ landDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error." });
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
    } = req.body;

    if (!flat_id && !area) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const landDetails = new FlatLandDetailsModel(
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
            flat_id
        );

        landDetails.save((data) => {
            res.status(201).json({
                data,
            });
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
    } = req.body;

    if (!id && !flat_id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const land = new FlatLandDetailsModel(
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
            flat_id
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
        const land = new FlatLandDetailsModel();
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
