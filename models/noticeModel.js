const { google } = require("googleapis");

const credentials = require("./credentials.json");
const sheetId = "1e1M7PECBEC0Mu9h7THbCVwjAqB1918tSAqAAcUm86lA";
const range = "Sheet1!A:H";

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class NoticeModel {
  constructor(
    title,
    url,
    date,
    type,
    text = "",
    signatory,
    status = 1,
    id = 0
  ) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.date = date;
    this.type = type;
    this.text = text;
    this.signatory = signatory;
    this.status = status;
  }

  save() {
    NoticeModel.getAllNotice((data) => {
      if (this.id > 0) {
        data = data.map((el) => (el.id == this.id ? this : el));
      } else {
        this.id = data.length + 1;
        data.push(this);
      }

      const updatedData = data.map((el) => [
        el.id,
        el.title,
        el.url,
        el.date,
        el.type,
        el.text,
        el.signatory,
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
            console.log("Notice saved successfully to Google Sheets!");
          }
        }
      );
    });
  }

  static getAllNotice(callback) {
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
          const notice = rows
            ? rows.map((row) => ({
                id: parseInt(row[0], 10),
                title: row[1],
                url: row[2],
                date: row[3],
                type: row[4],
                text: row[5],
                signatory: row[6],
                status: parseInt(row[7]),
              }))
            : [];
          callback(notice);
        }
      }
    );
  }

  static noticeFindById(id, callback) {
    NoticeModel.getAllNotice((notices) => {
      const el = notices.find((el) => el.id === id);
      callback(el);
    });
  }
};
