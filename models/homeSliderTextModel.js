// const fs = require("fs");
// const path = require("path");

// const rootDir = require("../utils/pathUtil");

// const homeSliderPath = path.join(rootDir, "data", "homeSliderText.json");

// module.exports = class HomeSlidersText {
//   constructor(text) {
//     this.text = text;
//   }

//   save() {
//     const updatedData = { text: this.text };

//     fs.writeFile(homeSliderPath, JSON.stringify(updatedData), (err) => {
//       if (err) {
//         console.error("Error saving homeSliderText:", err);
//       } else {
//         console.log("Text saved successfully!");
//       }
//     });
//   }

//   static getText(callback) {
//     fs.readFile(homeSliderPath, (err, data) => {
//       if (!err) {
//         const parsedData = JSON.parse(data);
//         callback(parsedData);
//       } else {
//         callback({ text: "" });
//       }
//     });
//   }
// };

const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1s8ejTFCy0vIVI__hwPa_Od1mXyMuRKeIuwzYKbO6zZY";
const range = "Sheet1!A1";

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class HomeSlidersText {
  constructor(text) {
    this.text = text;
  }

  save() {
    const updatedData = [[this.text]];
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
          console.error("Error saving text to Google Sheets:", err);
        } else {
          console.log("Text saved successfully to Google Sheets!");
        }
      }
    );
  }

  static getText(callback) {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: sheetId,
        range: range,
      },
      (err, res) => {
        if (err) {
          console.error("Error reading from Google Sheets:", err);
          callback({ text: "" });
        } else {
          const rows = res.data.values;
          if (rows && rows.length) {
            callback({ text: rows[0][0] || "" });
          } else {
            callback({ text: "" });
          }
        }
      }
    );
  }
};
