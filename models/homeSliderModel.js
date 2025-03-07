const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/pathUtil");

const homeSliderPath = path.join(rootDir, "data", "homeSlider.json");

module.exports = class HomeSliders {
  constructor(url) {
    this.url = url;
  }

  save() {
    HomeSliders.getAllSlider((data, callback) => {
      data.push(this);
      fs.writeFile(homeSliderPath, JSON.stringify(data), callback);
    });
  }

  static getAllSlider(callback) {
    fs.readFile(homeSliderPath, (err, data) => {
      if (!err) callback(JSON.parse(data));
      else callback([]);
    });
  }
};
