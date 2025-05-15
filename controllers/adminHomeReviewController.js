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
  HomeClientReview.getAllReview((data) => {
    const newDate = data.filter((el) => el.status != 0);

    res.status(200).json({
      data: newDate,
    });
  });
};

const getReview = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    HomeClientReview.reviewFindById(id, (data) => {
      res.status(200).json({ data });
    });
  }
};

const deleteReview = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    // const review = new HomeClientReview();
    // review.id = id;
    // review.status = 0;
    // review.save();

    await HomeClientReview.deleteById(id);

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
