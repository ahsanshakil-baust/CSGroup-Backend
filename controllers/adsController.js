const Advertisement = require("../models/advertisement");

const addAds = (req, res, next) => {
  const { type, url } = req.body;
  if (type == "" || url == "") {
    res.status(500).json({
      error: "Need to fill all necessary fields.",
    });
  } else {
    try {
      const ads = new Advertisement(type, url);
      ads.save();

      res.status(201).json({
        msg: "Ads added successfully!",
      });
    } catch (err) {
      res.status(500).json({
        msg: "Can't add Ads!",
      });
    }
  }
};

const getAds = (req, res, next) => {
  Advertisement.getAds((data) => res.status(200).json(data));
};

module.exports = {
  getAds,
  addAds,
};
