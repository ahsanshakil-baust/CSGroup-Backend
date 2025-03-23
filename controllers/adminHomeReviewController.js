const HomeClientReview = require("../models/homeClientReviewModel");

const addClientReview = (req, res, next) => {
    const { name, url, comment, star, video } = req.body;
    if (name == "" || url == "" || comment == "" || star == "") {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const review = new HomeClientReview(name, url, comment, star, video);
        review.save();

        res.status(201).json({
            msg: "Review added successfully!",
        });
    }
};

const updateReview = (req, res, next) => {
    const { id, name, url, comment, star, video } = req.body;

    if (!id || !url || !name || !comment || !star) {
        res.status(500).json({
            error: "Need to fill all necessary fields.",
        });
    } else {
        const review = new HomeClientReview(name, url, comment, star, video);
        review.id = id;
        review.save();
        res.status(201).json({
            msg: "Review updated successfully!",
        });
    }
};

const getAllReviews = (req, res, next) => {
    HomeClientReview.getAllReview((data) =>
        res.status(200).json({
            data,
        })
    );
};

const getReview = (req, res, next) => {
    const { id } = req.params;
    const convertedId = Number(id);

    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        HomeClientReview.reviewFindById(convertedId, (data) => {
            res.status(200).json({ data });
        });
    }
};

const deleteReview = (req, res, next) => {
    const { id } = req.body;
    if (!id) {
        res.status(500).json({
            error: "Need To Pass Id.",
        });
    } else {
        // HomeClientReview.deleteById(id, (err) => {
        //   if (err) res.status(500).json({ error: "Can't delete" });
        //   else res.status(200).json({ msg: "Deleted successfully!" });
        // });

        const review = new HomeClientReview();
        review.id = id;
        review.status = 0;
        review.save();
        res.status(201).json({
            msg: "Review deleted successfully!",
        });
    }
};

module.exports = {
    addClientReview,
    updateReview,
    getAllReviews,
    getReview,
    deleteReview,
};
