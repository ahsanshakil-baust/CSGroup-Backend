const OwnerModel = require("../models/flatOwnerModel");

const getAllOwner = (req, res, next) => {
    OwnerModel.getAllOwners((data) => {
        const newData = data.filter((el) => el.status != 0);
        res.status(200).json({ data: newData });
    });
};

// const getOwner = (req, res, next) => {
//     const { id } = req.params;
//     if (!id) {
//         res.status(500).json({
//             error: "Need To Pass Id.",
//         });
//     } else {
//         OwnerModel.ownerFindById(parseInt(id), (data) => {
//             const newData = data;
//             res.status(200).json({ data: newData });
//         });
//     }
// };

const getOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Need To Pass Id." });
        }

        // Fetch owner details using async/await
        const ownerData = await OwnerModel.ownerFindById(parseInt(id));

        // If no owner is found, return a 404 response
        if (!ownerData) {
            return res.status(404).json({ error: "Owner not found." });
        }

        // Send the response
        return res.status(200).json({ data: ownerData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error." });
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
