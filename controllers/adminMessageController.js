const MessageModel = require("../models/messageModel");

const addMessage = (req, res, next) => {
    const { name, url, designation, message } = req.body;
    if (name == "" || url == "" || message == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const messageObj = new MessageModel(name, url, designation, message);
        messageObj.save();

        res.status(201).json({
            msg: "Message added successfully!",
        });
    }
};

const updateMessage = (req, res, next) => {
    const { id, name, url, designation, message } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const messageObj = new MessageModel(name, url, designation, message);
        messageObj.id = id;
        messageObj.save();
        res.status(201).json({
            msg: "Message updated successfully!",
        });
    }
};

const getAllMessage = (req, res, next) => {
    MessageModel.getAllMessage((data) => {
        const newDate = data.filter((el) => el.status != 0);

        res.status(200).json({
            data: newDate,
        });
    });
};

const getMessage = (req, res, next) => {
    const { id } = req.params;
    const convertedId = Number(id);

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        MessageModel.messageFindById(convertedId, (data) => {
            res.status(200).json({ data });
        });
    }
};

const deleteMessage = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const message = new MessageModel();
        message.id = id;
        message.status = 0;
        message.save();
        res.status(201).json({
            msg: "Message deleted successfully!",
        });
    }
};

module.exports = {
    addMessage,
    updateMessage,
    deleteMessage,
    getAllMessage,
    getMessage,
};
