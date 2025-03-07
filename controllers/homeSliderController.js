const HomeSliders = require("../models/homeSliderModel");

const getAllSliderDetails = (req, res, next) => {
  HomeSliders.getAllSlider((data) =>
    res.status(200).send({
      data,
    })
  );
};

const getSliderDetails = (req, res, next) => {
  const { id } = req.body;
  HomeSliders.sliderFindById(id, (data) => {
    res.status(200).send({ data });
  });
};

const addSlider = (req, res, next) => {
  const slider = new HomeSliders(req.body.url);
  slider.save();

  res.status(201).send({
    msg: "Slider added successfully!",
  });
};

const updateSlider = (req, res, next) => {
  const { id, url } = req.body.url;
  const slider = new HomeSliders(url);
  slider.id = id;
  slider.save();

  res.status(201).send({
    msg: "Slider updated successfully!",
  });
};

const deleteSlider = (req, res, next) => {
  const { id } = req.body;
  HomeSliders.deleteById(id, (err) => {
    if (err) res.status(500).send({ error: "Can't delete" });
    else res.status(200).send({ msg: "Deleted successfully!" });
  });
};

module.exports = {
  getAllSliderDetails,
  addSlider,
  updateSlider,
  deleteSlider,
  getSliderDetails,
};
