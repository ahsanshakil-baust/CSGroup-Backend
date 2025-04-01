const ContactModel = require("../models/contactModel");

const addContact = (req, res, next) => {
    const { address, phone, email, whour, map } = req.body;
    const contact = new ContactModel(address, phone, email, whour, map);
    contact.save();

    res.status(201).json({
        msg: "Contact added successfully!",
    });
};

const getContact = (req, res, next) => {
    ContactModel.getContact((data) => {
        res.status(200).json({
            data,
        });
    });
};

module.exports = {
    addContact,
    getContact,
};
