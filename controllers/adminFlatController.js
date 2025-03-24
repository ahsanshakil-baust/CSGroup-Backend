const FlatModel = require("../models/flatModel");
const OwnerModel = require("../models/flatOwnerModel");
const LandDetailsModel = require("../models/landDetailsModel");
const ProjectModel = require("../models/projectModel");

const getAllFlats = (req, res, next) => {
    FlatModel.getAllFlat((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getFlatDetails = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        FlatModel.flatFindById(id, (data) => {
            let newData = data;

            OwnerModel.ownerFindById(parseInt(newData.owner_id), (data) => {
                const ownerData = data;

                newData = {
                    ...newData,
                    owner_details: ownerData,
                };

                LandDetailsModel.landFindById(
                    parseInt(newData.land_details_id),
                    parseInt(newData.project_id),
                    parseInt(newData.id),
                    (data) => {
                        newData = {
                            ...newData,
                            land_details: data,
                        };

                        ProjectModel.projectFindById(
                            parseInt(newData.project_id),
                            (data) => {
                                newData = {
                                    ...newData,
                                    project_details: data,
                                };
                                res.status(200).json({ data: newData });
                            }
                        );
                    }
                );
            });
        });
    }
};

const addFlat = (req, res, next) => {
    const {
        type,
        flat_number,
        floor,
        address,
        direction,
        bedrooms,
        drawing,
        dining,
        bathrooms,
        balconies,
        kitchen,
        lift,
        stair,
        generator,
        cctv,
        security_guard,
        others_facilities,
        flat_images,
        feature_images,
        flat_videos,
        completion_status,
        project_id,
        land_details_id,
        owner_id,
    } = req.body;
    if (
        !type &&
        !flat_number &&
        !floor &&
        !address &&
        !direction &&
        !land_details_id &&
        !project_id
    ) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const flat = new FlatModel(
            type,
            flat_number,
            floor,
            address,
            direction,
            bedrooms,
            drawing,
            dining,
            bathrooms,
            balconies,
            kitchen,
            lift,
            stair,
            generator,
            cctv,
            security_guard,
            others_facilities,
            flat_images,
            feature_images,
            flat_videos,
            completion_status,
            project_id,
            land_details_id,
            owner_id
        );

        flat.save();

        res.status(201).json({
            msg: "Flat added successfully!",
        });
    }
};

const updateFlat = (req, res, next) => {
    const {
        id,
        type,
        flat_number,
        floor,
        address,
        direction,
        bedrooms,
        drawing,
        dining,
        bathrooms,
        balconies,
        kitchen,
        lift,
        stair,
        generator,
        cctv,
        security_guard,
        others_facilities,
        flat_images,
        feature_images,
        flat_videos,
        completion_status,
        project_id,
        land_details_id,
        owner_id,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const flat = new FlatModel(
            type,
            flat_number,
            floor,
            address,
            direction,
            bedrooms,
            drawing,
            dining,
            bathrooms,
            balconies,
            kitchen,
            lift,
            stair,
            generator,
            cctv,
            security_guard,
            others_facilities,
            flat_images,
            feature_images,
            flat_videos,
            completion_status,
            project_id,
            land_details_id,
            owner_id
        );
        flat.id = id;
        flat.save();
        res.status(201).json({
            msg: "Flat updated successfully!",
        });
    }
};

const deleteFlat = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const flat = new FlatModel();
        flat.id = id;
        flat.status = 0;
        flat.save();
        res.status(201).json({
            msg: "Flat deleted successfully!",
        });
    }
};

module.exports = {
    getAllFlats,
    getFlatDetails,
    addFlat,
    updateFlat,
    deleteFlat,
};
