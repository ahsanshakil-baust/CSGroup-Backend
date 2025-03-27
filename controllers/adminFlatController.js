const FlatModel = require("../models/flatModel");
const OwnerModel = require("../models/flatOwnerModel");
const FlatLandDetailsModel = require("../models/flatLandDetailsModel");
const ProjectModel = require("../models/projectModel");
const ProjectOverviewModel = require("../models/projectLandOverview");

const getAllFlats = async (req, res, next) => {
    try {
        // Convert getAllFlat to return a Promise
        const flats = await new Promise((resolve, reject) => {
            FlatModel.getAllFlat((flats) => {
                if (!flats) return reject(new Error("No flats found"));
                resolve(flats);
            });
        });

        // Filter flats where status !== 0
        const filteredFlats = flats.filter((el) => el.status !== 0);

        if (filteredFlats.length === 0) {
            return res.status(200).json({ data: [] });
        }

        // Fetch land details and project details in parallel
        const flatDetailsPromises = filteredFlats.map(async (el) => {
            const [landDetails, project] = await Promise.all([
                FlatLandDetailsModel.landFindById(
                    el.land_details_id,
                    el.project_id
                ),
                ProjectModel.projectFindById(el.land_details_id),
            ]);

            return {
                ...el,
                land_details: landDetails || {},
                project_name: project?.name || "",
            };
        });

        // Wait for all promises to resolve
        const updatedFlats = await Promise.all(flatDetailsPromises);

        res.status(200).json({ data: updatedFlats });
    } catch (error) {
        next(error);
    }
};

const getFlatDetails = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ error: "Invalid or missing ID." });
        }

        // Fetch flat details
        const flat = await FlatModel.flatFindById(id);
        if (!flat) {
            return res.status(404).json({ error: "Flat not found." });
        }

        // Fetch all dependent data in parallel with error handling
        const [owner, landDetails, project, overview] = await Promise.all([
            OwnerModel.ownerFindById(flat.id).catch((err) => {
                console.error("Owner fetch error:", err);
                return null;
            }),
            FlatLandDetailsModel.landFindById(
                flat.land_details_id,
                flat.project_id
            ).catch((err) => {
                console.error("Land details fetch error:", err);
                return null;
            }),
            ProjectModel.projectFindById(flat.project_id).catch((err) => {
                console.error("Project fetch error:", err);
                return null;
            }),
            ProjectOverviewModel.overviewFindById(flat.project_id).catch(
                (err) => {
                    console.error("Overview fetch error:", err);
                    return null;
                }
            ),
        ]);

        // Construct response
        const newData = {
            ...flat,
            owner_details: owner || {},
            land_details: landDetails || {},
            project_details: project || {},
            overview: overview || {},
        };

        return res.status(200).json({ data: newData });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error." });
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
        flat_images,
        feature_images,
        flat_videos,
        completion_status,
        project_id,
        land_details_id,
        city,
        room_type,
        description,
        serial_no,
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
            flat_images,
            feature_images,
            flat_videos,
            completion_status,
            project_id,
            land_details_id,
            city,
            room_type,
            description,
            serial_no
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
        flat_images,
        feature_images,
        flat_videos,
        completion_status,
        project_id,
        land_details_id,
        city,
        room_type,
        description,
        serial_no,
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
            flat_images,
            feature_images,
            flat_videos,
            completion_status,
            project_id,
            land_details_id,
            city,
            room_type,
            description,
            serial_no
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
