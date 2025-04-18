const { google } = require("googleapis");

const credentials = require("./credentials.json");
const sheetId = "1QyOOkgcEJQWwQHdV4gR8SCPizUZ4fN9OCTqot7csL2Q";
const range = "Sheet1!A:C";

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class SkillModel {
  constructor(title, status = 1, id = 0) {
    this.id = id;
    this.title = title;
    this.status = status;
  }

  save() {
    SkillModel.getAllSkills((data) => {
      if (this.id > 0) {
        data = data.map((el) => (el.id == this.id ? this : el));
      } else {
        this.id = data.length + 1;
        data.push(this);
      }

      const updatedData = data.map((el) => [el.id, el.title, el.status]);

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
            console.error("Error saving data to Google Sheets:", err);
          } else {
            console.log("Certificate saved successfully to Google Sheets!");
          }
        }
      );
    });
  }

  static getAllSkills(callback) {
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
          const event = rows
            ? rows.map((row) => ({
                id: parseInt(row[0], 10),
                title: row[1],
                status: parseInt(row[2]),
              }))
            : [];
          callback(event);
        }
      }
    );
  }

  static skillFindById(id, callback) {
    return new Promise((resolve, reject) => {
      SkillModel.getAllSkills((skills) => {
        if (!skills) return reject(new Error("No Experience found"));
        const el = skills.filter((el) => el.portfolio_id == id) || null;
        resolve(el);
      });
    });
  }

  static skillById(id, callback) {
    return new Promise((resolve, reject) => {
      SkillModel.getAllSkills((skills) => {
        if (!skills) return reject(new Error("No Experience found"));
        const el = skills.find((el) => el.id == id) || null;
        resolve(el);
      });
    });
  }
};
