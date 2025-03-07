const HomeSliders = require("../models/homeSliderModel");

const getAllSliderDetails = (req, res, next) => {
  HomeSliders.getAllSlider((data) =>
    res.status(200).send({
      data,
    })
  );
};

const addSlider = (req, res, next) => {
  const slider = new HomeSliders(req.body.url);
  slider.save();

  res.status(201).send({
    msg: "Slider added successfully!",
  });
};

module.exports = {
  getAllSliderDetails,
  addSlider,
};
