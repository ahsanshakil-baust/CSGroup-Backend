const HomeSliders = require("../models/homeSliderModel");
const HomeSlidersText = require("../models/homeSliderTextModel");

const getAllSliderDetails = (req, res, next) => {
  HomeSliders.getAllSlider((data) =>
    res.status(200).json({
      data,
    })
  );
};

const getSliderDetails = (req, res, next) => {
  const { id } = req.body;
  HomeSliders.sliderFindById(id, (data) => {
    res.status(200).json({ data });
  });
};

const addSlider = (req, res, next) => {
  const slider = new HomeSliders(req.body.url);
  slider.save();

  res.status(201).json({
    msg: "Slider added successfully!",
  });
};

const updateSlider = (req, res, next) => {
  const { id, url } = req.body.url;
  const slider = new HomeSliders(url);
  slider.id = id;
  slider.save();

  res.status(201).json({
    msg: "Slider updated successfully!",
  });
};

const deleteSlider = (req, res, next) => {
  const { id } = req.body;
  HomeSliders.deleteById(id, (err) => {
    if (err) res.status(500).json({ error: "Can't delete" });
    else res.status(200).json({ msg: "Deleted successfully!" });
  });
};

const getSliderText = (req, res, next) => {
  HomeSlidersText.getSliderText((data) => {
    // if (!data || typeof data.text === "undefined") {
    //   return res.status(404).json({ error: "No slider text found" });
    // }
    // res.status(200).json(data);
    console.log(data);
  });
};

const addSliderText = (req, res, next) => {
  const slider = new HomeSlidersText(req.body.text);
  slider.save();

  res.status(201).json({
    msg: "Slider Text added successfully!",
  });
};

module.exports = {
  getAllSliderDetails,
  addSlider,
  updateSlider,
  deleteSlider,
  getSliderDetails,
  getSliderText,
  addSliderText,
};
