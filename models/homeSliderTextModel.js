const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/pathUtil");

const homeSliderPath = path.join(rootDir, "data", "homeSliderText.json");

module.exports = class HomeSlidersText {
  constructor(text) {
    this.text = text;
  }

  save() {
    const updatedData = { text: this.text };

    fs.writeFile(homeSliderPath, JSON.stringify(updatedData), (err) => {
      if (err) {
        console.error("Error saving homeSliderText:", err);
      } else {
        console.log("Text saved successfully!");
      }
    });
  }

  static getText(callback) {
    fs.readFile(homeSliderPath, (err, data) => {
      if (!err) {
        const parsedData = JSON.parse(data);
        callback(parsedData);
      } else {
        callback({ text: "" });
      }
    });
  }
};
