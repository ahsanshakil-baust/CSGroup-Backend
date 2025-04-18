const { google } = require("googleapis");

const credentials = require("./credentials.json");
const sheetId = "1X17gi-gH0xEgYmiwE5MERbIr3KBgJq44UOW7UuS8pwk";
const range = "Sheet1!A:J";

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class TeamMemberModel {
  constructor(
    name,
    url,
    designation,
    info,
    fb = "",
    likdn = "",
    twt = "",
    type,
    status = 1,
    id = 0
  ) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.designation = designation;
    this.info = info;
    this.fb = fb;
    this.likdn = likdn;
    this.twt = twt;
    this.type = type;
    this.status = status;
  }

  save() {
    TeamMemberModel.getAllTeamMember((data) => {
      if (this.id > 0) {
        data = data.map((el) => (el.id == this.id ? this : el));
      } else {
        this.id = data.length + 1;
        data.push(this);
      }

      const updatedData = data.map((el) => [
        el.id,
        el.name,
        el.url,
        el.designation,
        el.info,
        el.fb,
        el.likdn,
        el.twt,
        el.type,
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
            console.log("Team Member saved successfully to Google Sheets!");
          }
        }
      );
    });
  }

  static getAllTeamMember(callback) {
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
                name: row[1],
                url: row[2],
                designation: row[3],
                info: row[4],
                facebook: row[5],
                linkedin: row[6],
                twitter: row[7],
                type: row[8],
                status: parseInt(row[9]),
              }))
            : [];
          callback(notice);
        }
      }
    );
  }

  static teamMemberFindById(id, callback) {
    TeamMemberModel.getAllTeamMember((notices) => {
      const el = notices.find((el) => el.id === id);
      callback(el);
    });
  }

  static async teamMemberById(member_id) {
    return new Promise((resolve, reject) => {
      TeamMemberModel.getAllTeamMember((member) => {
        if (!member) return reject(new Error("No team details found"));

        const team =
          member.find((el) => parseInt(el.id) == parseInt(member_id)) || null;

        resolve(team);
      });
    });
  }
};
