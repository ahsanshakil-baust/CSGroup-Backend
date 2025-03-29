const ShareFlatModel = require("../models/shareFlatDetails");

const getAllShareFlat = (req, res, next) => {
    ShareFlatModel.getAllShareFlat((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getShareFlat = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Need To Pass Id." });
        }

        // Fetch the project overview using async/await
        const flat = await ShareFlatModel.shareFlatFindById(parseInt(id));

        // Send the response
        return res.status(200).json({ data: flat });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};

const addShareFlat = (req, res, next) => {
    const {
        bedrooms,
        bathrooms,
        balconies,
        drawing,
        dining,
        kitchen,
        lift,
        stair,
        cctv,
        generator,
        share_id,
    } = req.body;

    if (!project_id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const shareFlat = new ShareFlatModel(
            bedrooms,
            bathrooms,
            balconies,
            drawing,
            dining,
            kitchen,
            lift,
            stair,
            cctv,
            generator,
            share_id
        );

        shareFlat.save((data) => {
            res.status(201).json({
                data,
            });
        });
    }
};

const updateShareFlat = (req, res, next) => {
    const {
        id,
        bedrooms,
        bathrooms,
        balconies,
        drawing,
        dining,
        kitchen,
        lift,
        stair,
        cctv,
        generator,
        share_id,
    } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const shareFlat = new ShareFlatModel(
            bedrooms,
            bathrooms,
            balconies,
            drawing,
            dining,
            kitchen,
            lift,
            stair,
            cctv,
            generator,
            share_id
        );
        shareFlat.id = id;
        shareFlat.save((data) =>
            res.status(201).json({
                data,
            })
        );
    }
};

const deleteShareFlat = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const shareFlat = new ShareFlatModel();
        shareFlat.id = id;
        shareFlat.status = 0;
        shareFlat.save((data) =>
            res.status(201).json({
                msg: "Share Flat deleted successfully!",
            })
        );
    }
};

module.exports = {
    getAllShareFlat,
    getShareFlat,
    addShareFlat,
    updateShareFlat,
    deleteShareFlat,
};
