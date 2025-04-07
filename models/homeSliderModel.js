// const fs = require("fs");
// const path = require("path");

// const rootDir = require("../utils/pathUtil");

// const homeSliderPath = path.join(rootDir, "data", "homeSlider.json");

// module.exports = class HomeSliders {
//   constructor(url) {
//     this.id = 0;
//     this.url = url;
//   }

//   save() {
//     HomeSliders.getAllSlider((data) => {
//       if (this.id > 0) {
//         data = data.map((slider) => {
//           if (slider.id === this.id) {
//             return this;
//           }

//           return slider;
//         });
//       } else {
//         this.id = data.length + 1;
//         data.push(this);
//       }
//       fs.writeFile(homeSliderPath, JSON.stringify(data), (err) => {
//         if (err) {
//           console.log("Something went wrong!");
//         }
//       });
//     });
//   }

//   static getAllSlider(callback) {
//     fs.readFile(homeSliderPath, (err, data) => {
//       if (!err) callback(JSON.parse(data));
//       else callback([]);
//     });
//   }

//   static sliderFindById(id, callback) {
//     HomeSliders.getAllSlider((slider) => {
//       const sliderFound = slider.find((el) => el.id === id);
//       callback(sliderFound);
//     });
//   }

//   static deleteById(id, callback) {
//     HomeSliders.getAllSlider((data) => {
//       data = data.filter((slider) => slider.id !== id);
//       fs.writeFile(homeSliderPath, JSON.stringify(data), callback);
//     });
//   }
// };

const { google } = require("googleapis");

const credentials = require("./credentials.json");
const sheetId = "1BwR9akqSatx0-gentq8HOe6QXU5Q5niX7bAxvYFRfi0";
const range = "Sheet1!A1:C";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class HomeSliders {
    constructor(url, status = 1, id = 0) {
        this.id = id;
        this.url = url;
        this.status = status;
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

            const updatedData = data.map((slider) => [
                slider.id,
                slider.url,
                slider.status,
            ]);

            sheets.spreadsheets.values.update(
                {
                    spreadsheetId: sheetId,
                    range: range,
                    valueInputOption: "RAW",
                    requestBody: {
                        values: updatedData,
                    },
                },
                (err, res) => {
                    if (err) {
                        console.error(
                            "Error saving data to Google Sheets:",
                            err
                        );
                    } else {
                        console.log(
                            "Data saved successfully to Google Sheets!"
                        );
                    }
                }
            );
        });
    }

    static getAllSlider(callback) {
        sheets.spreadsheets.values.get(
            {
                spreadsheetId: sheetId,
                range: range,
            },
            (err, res) => {
                if (err) {
                    console.error("Error reading from Google Sheets:", err);
                    callback([]);
                } else {
                    const rows = res.data.values;
                    const sliders = rows
                        ? rows.map((row) => ({
                              id: parseInt(row[0], 10),
                              url: row[1],
                              status: parseInt(row[2]),
                          }))
                        : [];
                    callback(sliders);
                }
            }
        );
    }

    static sliderFindById(id, callback) {
        HomeSliders.getAllSlider((sliders) => {
            const slider = sliders.find((slider) => slider.id === id);
            callback(slider);
        });
    }
};
