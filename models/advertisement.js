const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1lXUDtlXSpipTcBva_CFY-qrC_OZyhdKOql9PLNXyvDQ";
const range = "Sheet1!A1:B";

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class Advertisement {
  constructor(type, url) {
    this.type = type;
    this.url = url;
  }

  save() {
    sheets.spreadsheets.values.update(
      {
        spreadsheetId: sheetId,
        range: range,
        valueInputOption: "RAW",
        requestBody: {
          values: [[this.type, this.url]],
        },
      },
      (err, res) => {
        if (err) {
          console.error("Error saving data to Google Sheets:", err);
        } else {
          console.log("Data saved successfully to Google Sheets!");
        }
      }
    );
  }

  static getAds(callback) {
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: sheetId,
        range: range,
      },
      (err, res) => {
        if (err) {
          console.error("Error reading from Google Sheets:", err);
          callback({});
        } else {
          const rows = res.data.values;

          if (rows && rows.length) {
            callback({ type: rows[0][0] || "", url: rows[0][1] || "" });
          } else {
            callback({ type: "", url: "" });
          }
        }
      }
    );
  }
};
