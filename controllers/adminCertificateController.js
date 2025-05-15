const CertificateModel = require("../models/certificateModel");

const addCertificate = (req, res, next) => {
    const { title, where, url, date } = req.body;
    if (title == "" || url == "" || date == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const certificate = new CertificateModel(title, where, url, date);
        certificate.save();

        res.status(201).json({
            msg: "Certificate added successfully!",
        });
    }
};

const updateCertificate = (req, res, next) => {
    const { id, title, where, url, date } = req.body;

    if (!id || !url || !title || !date) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const certificate = new CertificateModel(title, where, url, date);
        certificate.id = id;
        certificate.save();
        res.status(201).json({
            msg: "Certificate updated successfully!",
        });
    }
};

const getAllCertificate = (req, res, next) => {
    CertificateModel.getAllCertificate((data) => {
        const newDate = data.filter((el) => el.status != 0);

        res.status(200).json({
            data: newDate,
        });
    });
};

const getCertificate = (req, res, next) => {
    const { id } = req.params;
    const convertedId = id;

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        CertificateModel.certificateFindById(convertedId, (data) => {
            res.status(200).json({ data });
        });
    }
};

const deleteCertificate = async (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        // const certificate = new CertificateModel();
        // certificate.id = id;
        // certificate.status = 0;
        // certificate.save();
        await CertificateModel.deleteById(id);
        res.status(201).json({
            msg: "Certificate deleted successfully!",
        });
    }
};

module.exports = {
    addCertificate,
    updateCertificate,
    deleteCertificate,
    getAllCertificate,
    getCertificate,
};
