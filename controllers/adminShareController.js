const ShareFlatModel = require("../models/shareFlatDetails");
const ShareLandDetailsModel = require("../models/shareLandDetails");
const ShareModel = require("../models/shareModel");

const getAllShares = async (req, res, next) => {
    ShareModel.getAllShares(async (data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getShare = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        if (!id) {
            return res.status(400).json({ error: "Need To Pass Id." });
        }

        // Fetch all independent data in parallel
        const [share, landDetails, flatDetails] = await Promise.all([
            ShareModel.shareFindById(id),
            ShareLandDetailsModel.landFindById(id),
            ShareFlatModel.shareFlatFindById(id),
        ]);

        if (!share) {
            return res.status(404).json({ error: "Share not found." });
        }

        let newData = { ...share, land_details: landDetails, flatDetails };

        return res.status(200).json({ data: newData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

const addShare = (req, res, next) => {
    const {
        name,
        project_type,
        location,
        description,
        share_videos,
        project_images,
        map_url,
        project_structure,
    } = req.body;
    if (name == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const share = new ShareModel(
            name,
            project_type,
            location,
            description,
            share_videos,
            project_images,
            map_url,
            project_structure
        );
        share.save((id) =>
            res.status(201).json({
                id,
            })
        );
    }
};

const updateShare = (req, res, next) => {
    const {
        id,
        name,
        project_type,
        location,
        description,
        share_videos,
        project_images,
        map_url,
        project_structure,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const share = new ShareModel(
            name,
            project_type,
            location,
            description,
            share_videos,
            project_images,
            map_url,
            project_structure
        );
        share.id = id;
        share.save((id) =>
            res.status(201).json({
                id,
            })
        );
    }
};

const deleteShare = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const share = new ShareModel();
        share.id = id;
        share.status = 0;
        share.save((data) =>
            res.status(201).json({
                msg: "Share deleted successfully!",
            })
        );
    }
};

module.exports = {
    getAllShares,
    getShare,
    addShare,
    updateShare,
    deleteShare,
};
