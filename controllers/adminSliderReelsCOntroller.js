const HomeSliderReelsModel = require("../models/homeSliderReels");

const addReel = (req, res, next) => {
  const { title, url } = req.body;
  if (title == "" || url == "") {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const reel = new HomeSliderReelsModel(title, url);
    reel.save();

    res.status(201).json({
      msg: "Reel added successfully!",
    });
  }
};

const updateReel = (req, res, next) => {
  const { id, title, url } = req.body;

  if (!id) {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    const reel = new HomeSliderReelsModel(title, url);
    reel.id = id;
    reel.save();
    res.status(201).json({
      msg: "Reel updated successfully!",
    });
  }
};

const getAllReel = (req, res, next) => {
  HomeSliderReelsModel.getAllReels((data) => {
    const newDate = data.filter((el) => el.status != 0);

    res.status(200).json({
      data: newDate,
    });
  });
};

const getReel = (req, res, next) => {
  const { id } = req.params;
  const convertedId = Number(id);

  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    HomeSliderReelsModel.reelsFindById(convertedId, (data) => {
      res.status(200).json({ data });
    });
  }
};

const deleteReel = async (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    res.status(500).json({
      error: "Need To Pass Id.",
    });
  } else {
    // const reel = new HomeSliderReelsModel();
    // reel.id = id;
    // reel.status = 0;
    // reel.save();

    await HomeSliderReelsModel.deleteById(id);

    res.status(201).json({
      msg: "Reel deleted successfully!",
    });
  }
};

module.exports = {
  addReel,
  updateReel,
  deleteReel,
  getAllReel,
  getReel,
};
