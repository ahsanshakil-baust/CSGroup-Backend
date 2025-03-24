const FlatModel = require("../models/flatModel");
const OwnerModel = require("../models/flatOwnerModel");
const LandDetailsModel = require("../models/landDetailsModel");
const ProjectModel = require("../models/projectModel");

// const getAllFlats = (req, res, next) => {
//     FlatModel.getAllFlat((data) => {
//         const newData = data.filter((el) => el.status != 0);

//         newData.map((el) => {
//             LandDetailsModel.landFindById(
//                 parseInt(el.land_details_id),
//                 parseInt(el.project_id),
//                 (data) => {
//                     // console.log(data);

//                     // res.status(200).json({
//                     //     data: {
//                     //         ...newData,
//                     //         land_details: data ? data : {},
//                     //     },
//                     // });
//                     data, el;
//                 }
//             );
//         });

//         res.status(200).json({
//             data: newData,
//         });
//     });
// };

const getAllFlats = async (req, res, next) => {
    try {
        FlatModel.getAllFlat(async (flats) => {
            const newData = flats.filter((el) => el.status !== 0);

            const updatedFlats = await Promise.all(
                newData.map(
                    (el) =>
                        new Promise((resolve) => {
                            LandDetailsModel.landFindById(
                                parseInt(el.land_details_id),
                                parseInt(el.project_id),
                                (landData) => {
                                    resolve({
                                        ...el,
                                        land_details: landData || {},
                                    });
                                }
                            );
                        })
                )
            );

            const updatedFlatsWithProject = await Promise.all(
                updatedFlats.map(
                    (el) =>
                        new Promise((resolve) => {
                            ProjectModel.projectFindById(
                                parseInt(el.land_details_id),
                                (project) => {
                                    resolve({
                                        ...el,
                                        project_name: project.name || "",
                                    });
                                }
                            );
                        })
                )
            );

            res.status(200).json({ data: updatedFlatsWithProject });
        });
    } catch (error) {
        next(error);
    }
};

const getFlatDetails = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        FlatModel.flatFindById(parseInt(id), (data) => {
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

// const getFlatDetails = async (req, res, next) => {
//     try {
//         const { id } = req.params;
//         console.log(id);

//         if (!id) {
//             return res.status(400).json({ error: "Need to pass ID." });
//         }

//         // Fetch Flat Details
//         const flatData = await FlatModel.flatFindById(parseInt(id));
//         if (!flatData) {
//             return res.status(404).json({ error: "Flat not found." });
//         }

//         // Fetch Owner Details
//         const ownerData = await OwnerModel.ownerFindById(
//             parseInt(flatData.owner_id)
//         );
//         if (ownerData) {
//             flatData.owner_details = ownerData;
//         }

//         // Fetch Land Details
//         const landDetails = await LandDetailsModel.landFindById(
//             parseInt(flatData.land_details_id),
//             parseInt(flatData.project_id),
//             parseInt(flatData.id)
//         );
//         if (landDetails) {
//             flatData.land_details = landDetails;
//         }

//         // Fetch Project Details
//         const projectDetails = await ProjectModel.projectFindById(
//             parseInt(flatData.project_id)
//         );
//         if (projectDetails) {
//             flatData.project_details = projectDetails;
//         }

//         res.status(200).json({ data: flatData });
//     } catch (error) {
//         console.error("Error fetching flat details:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

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
        city,
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
            city
        );

        flat.save((data) => {
            res.status(201).json({
                data,
            });
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
        city,
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
            city
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
