const OthersFacilitiesModel = require("../models/otherFacilitiesModel");

const getAllProjectFacilities = (req, res, next) => {
    OthersFacilitiesModel.getAllFacilities((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getProjectFacilities = (req, res, next) => {
    const { project_id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        OthersFacilitiesModel.facilitiesFindById({ project_id }, (data) => {
            const newData = data.filter((el) => el.status != 0);
            res.status(200).json({ newData });
        });
    }
};

const addProjectFacilities = (req, res, next) => {
    const {
        lift,
        stair,
        generator,
        cctv,
        security_guard,
        others_facilities,
        project_id,
    } = req.body;

    if (!project_id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const landDetails = new OthersFacilitiesModel(
            lift,
            stair,
            generator,
            cctv,
            security_guard,
            others_facilities,
            project_id
        );

        landDetails.save((data) => {
            res.status(201).json({
                data,
            });
        });
    }
};

const updateProjectFacilities = (req, res, next) => {
    const {
        id,
        lift,
        stair,
        generator,
        cctv,
        security_guard,
        others_facilities = [],
        project_id,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const land = new OthersFacilitiesModel(
            lift,
            stair,
            generator,
            cctv,
            security_guard,
            (others_facilities = []),
            project_id
        );
        land.id = id;
        land.save();
        res.status(201).json({
            msg: "Land Details updated successfully!",
        });
    }
};

const deleteProjectFacilities = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const land = new OthersFacilitiesModel();
        land.id = id;
        land.status = 0;
        land.save();
        res.status(201).json({
            msg: "Land deleted successfully!",
        });
    }
};

module.exports = {
    getAllProjectFacilities,
    getProjectFacilities,
    addProjectFacilities,
    updateProjectFacilities,
    deleteProjectFacilities,
};
