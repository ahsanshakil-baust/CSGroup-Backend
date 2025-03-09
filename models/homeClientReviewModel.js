const fs = require("fs");
const path = require("path");

const rootDir = require("../utils/pathUtil");

const homeClientReviewPath = path.join(
  rootDir,
  "data",
  "homeClientReview.json"
);

module.exports = class HomeClientReview {
  constructor(name, url, comment, star) {
    this.id = 0;
    this.name = name;
    this.url = url;
    this.comment = comment;
    this.star = star;
  }

  save() {
    HomeClientReview.getAllReview((data) => {
      if (this.id > 0) {
        data = data.map((review) => {
          if (review.id === this.id) {
            return this;
          }
          return review;
        });
      } else {
        this.id = data.length + 1;
        data.push(this);
      }

      fs.writeFile(homeClientReviewPath, JSON.stringify(data), (err) => {
        if (err) {
          console.log("Something went wrong!");
        }
      });
    });
  }

  static getAllReview(callback) {
    fs.readFile(homeClientReviewPath, (err, data) => {
      if (!err) callback(JSON.parse(data));
      else callback([]);
    });
  }

  static reviewFindById(id, callback) {
    HomeClientReview.getAllReview((review) => {
      const reviewFound = review.find((el) => el.id === id);
      callback(reviewFound);
    });
  }

  static deleteById(id, callback) {
    HomeClientReview.getAllReview((data) => {
      data = data.filter((review) => review.id !== id);
      fs.writeFile(homeClientReviewPath, JSON.stringify(data), callback);
    });
  }
};
