const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "15tL2aXEHssjjUF4MwwrmK6EaSviKfq28Pq_TWKn4sjc";
const range = "Sheet1!A:I";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class ProjectModel {
    constructor(
        name,
        project_type,
        location,
        description,
        land_videos = [],
        project_images = [],
        map_url,
        id = 0,
        status = 1
    ) {
        this.id = id;
        this.name = name;
        this.project_type = project_type;
        this.location = location;
        this.description = description;
        this.land_videos = land_videos;
        this.project_images = project_images;
        this.map_url = map_url;
        this.status = status;
    }

    save(callback) {
        ProjectModel.getAllProjects((projects) => {
            if (this.id > 0) {
                projects = projects.map((project) =>
                    project.id == this.id ? this : project
                );
            } else {
                this.id = projects.length + 1;
                projects.push(this);
                callback(this.id);
            }

            const updatedData = projects.map((project) => [
                project.id,
                project.name,
                project.project_type,
                project.location,
                project.description,
                JSON.stringify(project.land_videos),
                JSON.stringify(project.project_images),
                project.map_url,
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
                              project_type: row[2],
                              location: row[3],
                              description: row[4],
                              land_videos: JSON.parse(row[5] || "[]"),
                              project_images: JSON.parse(row[6] || "[]"),
                              map_url: row[7],
                              status: parseInt(row[8]),
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
