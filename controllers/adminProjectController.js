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

const getProject = (req, res, next) => {
    const { id } = req.params;

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        ProjectModel.projectFindById(parseInt(id), (data) => {
            let newData = data;

            ProjectLandDetailsModel.projectLandFindById(
                parseInt(id),
                (data) => {
                    newData = {
                        ...newData,
                        land_details: data,
                    };

                    // ProjectOverviewModel.overviewFindById(
                    //     parseInt(id),
                    //     (data) => {
                    //         newData = {
                    //             ...newData,
                    //             overview: data,
                    //         };

                    //         if (data.floors) {
                    //             const loop = parseInt(data.floors);
                    //             let obj = {};

                    //             for (let i = 0; i < loop; i++) {
                    //                 const key = `floor${i + 1}`;

                    //                 FlatModel.flatIdByProjectFloor(
                    //                     parseInt(id),
                    //                     i + 1,
                    //                     (data) => {
                    //                         obj[key] = data;
                    //                     }
                    //                 );
                    //             }

                    //             console.log(obj);

                    //             newData = { ...newData, floor_list: obj };
                    //             res.status(200).json({ data: newData });
                    //         } else {
                    //             res.status(200).json({ data: newData });
                    //         }
                    //     }
                    // );

                    ProjectOverviewModel.overviewFindById(
                        parseInt(id),
                        async (data) => {
                            newData = {
                                ...newData,
                                overview: data,
                            };

                            if (data.floors) {
                                const loop = parseInt(data.floors);
                                let obj = {};

                                const promises = [];

                                for (let i = 0; i < loop; i++) {
                                    const key = `${i + 1}`;

                                    // Push each async operation into an array of promises
                                    promises.push(
                                        new Promise((resolve) => {
                                            FlatModel.flatIdByProjectFloor(
                                                parseInt(id),
                                                i + 1,
                                                (flatData) => {
                                                    obj[key] = flatData;
                                                    resolve(); // Resolve when data is set
                                                }
                                            );
                                        })
                                    );
                                }

                                // Wait for all async operations to finish
                                await Promise.all(promises);

                                console.log(obj);

                                newData = { ...newData, floor_list: obj };
                                res.status(200).json({ data: newData });
                            } else {
                                res.status(200).json({ data: newData });
                            }
                        }
                    );
                }
            );
        });
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
            map_url
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
            map_url
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
        project.save();
        res.status(201).json({
            msg: "Project deleted successfully!",
        });
    }
};

module.exports = {
    getAllProject,
    getProject,
    addProject,
    updateProject,
    deleteProject,
};
