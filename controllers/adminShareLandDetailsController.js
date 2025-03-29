const ShareLandDetailsModel = require("../models/shareLandDetails");

const getAllShareLandDetails = (req, res, next) => {
    ShareLandDetailsModel.getAllLandDetails((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getShareLandDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Need To Pass Id." });
        }

        // Fetch land details
        const landDetails = await ShareLandDetailsModel.landFindById(id);

        return res.status(200).json({ data: landDetails });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

const addShareLandDetails = (req, res, next) => {
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
        share_id,
        total_floor,
        total_flat,
    } = req.body;

    if (!share_id && !area) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const landDetails = new ShareLandDetailsModel(
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
            share_id,
            total_floor,
            total_flat
        );

        landDetails.save((data) => {
            res.status(201).json({
                data,
            });
        });
    }
};

const updateShareLandDetails = (req, res, next) => {
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
        share_id,
        total_floor,
        total_flat,
    } = req.body;

    if (!id && !share_id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const land = new ShareLandDetailsModel(
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
            share_id,
            total_floor,
            total_flat
        );
        land.id = id;
        land.save((data) => {
            res.status(201).json({
                data,
            });
        });
    }
};

const deleteShareLandDetails = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const land = new ShareLandDetailsModel();
        land.id = id;
        land.status = 0;
        land.save((data) =>
            res.status(201).json({
                msg: "Land deleted successfully!",
            })
        );
    }
};

module.exports = {
    getAllShareLandDetails,
    getShareLandDetails,
    addShareLandDetails,
    updateShareLandDetails,
    deleteShareLandDetails,
};
