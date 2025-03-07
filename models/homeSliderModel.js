const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/pathUtil");

const homeSliderPath = path.join(rootDir, "data", "homeSlider.json");

module.exports = class HomeSliders {
  constructor(url) {
    this.id = 0;
    this.url = url;
  }

  save() {
    HomeSliders.getAllSlider((data) => {
      if (this.id > 0) {
        data = data.map((slider) => {
          if (slider.id === this.id) {
            return this;
          }

          return slider;
        });
      } else {
        this.id = data.length + 1;
        data.push(this);
      }
      fs.writeFile(homeSliderPath, JSON.stringify(data), (err) => {
        if (err) {
          console.log("Something went wrong!");
        }
      });
    });
  }

  static getAllSlider(callback) {
    fs.readFile(homeSliderPath, (err, data) => {
      if (!err) callback(JSON.parse(data));
      else callback([]);
    });
  }

  static sliderFindById(id, callback) {
    HomeSliders.getAllSlider((slider) => {
      const sliderFound = slider.find((el) => el.id === id);
      callback(sliderFound);
    });
  }

  static deleteById(id, callback) {
    HomeSliders.getAllSlider((data) => {
      data = data.filter((slider) => slider.id !== id);
      fs.writeFile(homeSliderPath, JSON.stringify(data), callback);
    });
  }
};
