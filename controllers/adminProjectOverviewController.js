const ProjectOverviewModel = require("../models/projectLandOverview");

const getAllProjectOverview = (req, res, next) => {
    ProjectOverviewModel.getAllOverview((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getProjectOverview = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Need To Pass Id." });
        }

        // Fetch the project overview using async/await
        const overview = await ProjectOverviewModel.overviewFindById(id);

        // Send the response
        return res.status(200).json({ data: overview });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

const addProjectOverview = (req, res, next) => {
    const {
        unit,
        floors,
        generator,
        flats,
        lift,
        car_parking,
        community_center,
        stair,
        cctv,
        security_guard,
        others_facilities,
        project_id,
        basement,
    } = req.body;

    if (!project_id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const overviewDetails = new ProjectOverviewModel(
            unit,
            floors,
            generator,
            flats,
            lift,
            car_parking,
            community_center,
            stair,
            cctv,
            security_guard,
            others_facilities,
            project_id,
            basement
        );

        overviewDetails.save((data) => {
            res.status(201).json({
                data,
            });
        });
    }
};

const updateProjectOverview = (req, res, next) => {
    const {
        id,
        unit,
        floors,
        generator,
        flats,
        lift,
        car_parking,
        community_center,
        stair,
        cctv,
        security_guard,
        others_facilities,
        project_id,
        basement,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const land = new ProjectOverviewModel(
            unit,
            floors,
            generator,
            flats,
            lift,
            car_parking,
            community_center,
            stair,
            cctv,
            security_guard,
            others_facilities,
            project_id,
            basement
        );
        land.id = id;
        land.save((data) =>
            res.status(201).json({
                data,
            })
        );
    }
};

const deleteProjectOverview = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const land = new ProjectOverviewModel();
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
    getAllProjectOverview,
    getProjectOverview,
    addProjectOverview,
    updateProjectOverview,
    deleteProjectOverview,
};
