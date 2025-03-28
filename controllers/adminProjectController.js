const FlatModel = require("../models/flatModel");
const ProjectLandDetailsModel = require("../models/projectLandDetailsModel");
const ProjectOverviewModel = require("../models/projectLandOverview");
const ProjectModel = require("../models/projectModel");

const getAllProject = async (req, res, next) => {
    ProjectModel.getAllProjects(async (data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getProject = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({ error: "Need To Pass Id." });
        }

        // Fetch all independent data in parallel
        const [project, landDetails, overview] = await Promise.all([
            ProjectModel.projectFindById(id),
            ProjectLandDetailsModel.projectLandFindById(id),
            ProjectOverviewModel.overviewFindById(id),
        ]);

        if (!project) {
            return res.status(404).json({ error: "Project not found." });
        }

        let newData = { ...project, land_details: landDetails, overview };

        // If overview contains floors, fetch all flats in parallel
        if (overview?.floors) {
            const floorPromises = Array.from(
                { length: overview.floors },
                (_, i) => FlatModel.flatIdByProjectFloor(id, i)
            );

            const floorResults = await Promise.all(floorPromises);

            const floor_list = floorResults.map((flats, i) => ({
                floor_number: i,
                room_type: flats.length > 0 && flats[0].room_type,
                flats: flats,
            }));

            newData.floor_list = floor_list;
        }

        return res.status(200).json({ data: newData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

const addProject = (req, res, next) => {
    const {
        name,
        project_type,
        location,
        description,
        land_videos,
        project_images,
        map_url,
        project_structure,
    } = req.body;
    if (name == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const project = new ProjectModel(
            name,
            project_type,
            location,
            description,
            land_videos,
            project_images,
            map_url,
            project_structure
        );
        project.save((id) =>
            res.status(201).json({
                id,
            })
        );
    }
};

const updateProject = (req, res, next) => {
    const {
        id,
        name,
        project_type,
        location,
        description,
        land_videos,
        project_images,
        map_url,
        project_structure,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const project = new ProjectModel(
            name,
            project_type,
            location,
            description,
            land_videos,
            project_images,
            map_url,
            project_structure
        );
        project.id = id;
        project.save((id) =>
            res.status(201).json({
                id,
            })
        );
    }
};

const deleteProject = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const project = new ProjectModel();
        project.id = id;
        project.status = 0;
        project.save((data) =>
            res.status(201).json({
                msg: "Project deleted successfully!",
            })
        );
    }
};

module.exports = {
    getAllProject,
    getProject,
    addProject,
    updateProject,
    deleteProject,
};
