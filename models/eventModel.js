const { google } = require("googleapis");

const credentials = require("./credentials.json");
const sheetId = "1ZrOxKyLt1Qya-jBDer0RKMNFaA0Ty_EyJU2-NltzhPA";
const range = "Sheet1!A:H";

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class EventModel {
  constructor(
    title,
    location,
    images,
    videos,
    date,
    serial,
    status = 1,
    id = 0
  ) {
    this.id = id;
    this.title = title;
    this.location = location;
    this.images = images;
    this.videos = videos;
    this.date = date;
    this.serial = serial;
    this.status = status;
  }

  save() {
    EventModel.getAllEvent((data) => {
      if (this.id > 0) {
        data = data.map((el) => (el.id == this.id ? this : el));
      } else {
        this.id = data.length + 1;
        data.push(this);
      }

      const updatedData = data.map((el) => [
        el.id,
        el.title,
        el.location,
        JSON.stringify(el.images),
        JSON.stringify(el.videos),
        el.date,
        el.serial,
        el.status,
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
            console.error("Error saving data to Google Sheets:", err);
          } else {
            console.log("Event saved successfully to Google Sheets!");
          }
        }
      );
    });
  }

  static getAllEvent(callback) {
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
                location: row[2],
                images: JSON.parse(row[3] || "[]"),
                videos: JSON.parse(row[4] || "[]"),
                date: row[5],
                serial: row[6],
                status: parseInt(row[7]),
              }))
            : [];
          callback(event);
        }
      }
    );
  }

  static eventFindById(id, callback) {
    EventModel.getAllEvent((events) => {
      const el = events.find((el) => el.id === id);
      callback(el);
    });
  }
};
