const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "15tL2aXEHssjjUF4MwwrmK6EaSviKfq28Pq_TWKn4sjc";
const range = "Sheet1!A:C";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class ProjectModel {
    constructor(name, id = 0, status = 1) {
        this.id = id;
        this.name = name;
        this.status = status;
    }

    save() {
        ProjectModel.getAllProjects((projects) => {
            if (this.id > 0) {
                projects = projects.map((project) =>
                    project.id == this.id ? this : project
                );
            } else {
                this.id = projects.length + 1;
                projects.push(this);
            }

            const updatedData = projects.map((project) => [
                project.id,
                project.name,
                project.status,
            ]);

            sheets.spreadsheets.values.update(
                {
                    spreadsheetId: sheetId,
                    range: range,
                    valueInputOption: "RAW",
                    requestBody: { values: updatedData },
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

    static getAllProjects(callback) {
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
                    const project = rows
                        ? rows.map((row) => ({
                              id: parseInt(row[0], 10),
                              name: row[1],
                              status: parseInt(row[2]),
                          }))
                        : [];

                    callback(project);
                }
            }
        );
    }

    static async projectFindById(id, callback) {
        ProjectModel.getAllProjects((flats) => {
            const flat = flats.find((project) => project.id === id) || null;
            callback(flat);
        });
    }
};
