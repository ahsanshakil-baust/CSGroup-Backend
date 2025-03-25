const OwnerModel = require("../models/flatOwnerModel");

const getAllOwner = (req, res, next) => {
    OwnerModel.getAllOwners((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

const getOwner = (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        OwnerModel.ownerFindById(parseInt(id), (data) => {
            const newData = data;
            res.status(200).json({ data: newData });
        });
    }
};

const addOwner = (req, res, next) => {
    const { name, image, occupation, blood_group, p_address, mobile, flat_id } =
        req.body;
    if (name == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const owner = new OwnerModel(
            name,
            image,
            occupation,
            blood_group,
            p_address,
            mobile,
            flat_id
        );
        owner.save();

        res.status(201).json({
            msg: "Owner added successfully!",
        });
    }
};

const updateOwner = (req, res, next) => {
    const {
        id,
        name,
        image,
        occupation,
        blood_group,
        p_address,
        mobile,
        flat_id,
    } = req.body;

    if (!id || !name) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const owner = new OwnerModel(
            name,
            image,
            occupation,
            blood_group,
            p_address,
            mobile,
            flat_id
        );
        owner.id = id;
        owner.save();
        res.status(201).json({
            msg: "Owner updated successfully!",
        });
    }
};

const deleteOwner = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const owner = new OwnerModel();
        owner.id = id;
        owner.status = 0;
        owner.save();
        res.status(201).json({
            msg: "Owner deleted successfully!",
        });
    }
};

module.exports = {
    getAllOwner,
    getOwner,
    addOwner,
    updateOwner,
    deleteOwner,
};
