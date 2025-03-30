const EventModel = require("../models/eventModel");
const randomTook = require("../utils/randomTook");

const addEvent = (req, res, next) => {
    const { title, location, images, videos, date } = req.body;
    if (title == "" || date == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const event = new EventModel(title, location, images, videos, date);
        event.save();

        res.status(201).json({
            msg: "Event added successfully!",
        });
    }
};

const updateEvent = (req, res, next) => {
    const { id, title, location, images, videos, date } = req.body;

    if (!id) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const event = new EventModel(title, location, images, videos, date);
        event.id = id;
        event.save();
        res.status(201).json({
            msg: "Event updated successfully!",
        });
    }
};

const getAllEvent = (req, res, next) => {
    EventModel.getAllEvent((data) => {
        const newData = data.filter((el) => el.status != 0);

        res.status(200).json({
            data: newData,
        });
    });
};

const getEventReels = (req, res, next) => {
    EventModel.getAllEvent((data) => {
        const arr = [];
        const newData = data.filter((el) => el.status != 0);

        newData.forEach((el) => {
            const rand = randomTook(newData.length);
            arr.push(el.images[rand]);
        });

        res.status(200).json({
            data: arr,
        });
    });
};

const getEvent = (req, res, next) => {
    const { id } = req.params;
    const convertedId = Number(id);

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        EventModel.eventFindById(convertedId, (data) => {
            res.status(200).json({ data });
        });
    }
};

const deleteEvent = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        const event = new EventModel();
        event.id = id;
        event.status = 0;
        event.save();
        res.status(201).json({
            msg: "Event deleted successfully!",
        });
    }
};

module.exports = {
    addEvent,
    updateEvent,
    deleteEvent,
    getAllEvent,
    getEvent,
    getEventReels,
};
