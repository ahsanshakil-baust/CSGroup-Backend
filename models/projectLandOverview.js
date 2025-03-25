const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1JN_MPMETMui6VuJbkqupvacjZ9rXhvYEsW8WsuOUfss";
const range = "Sheet1!A:N";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class ProjectOverviewModel {
    constructor(
        unit,
        floors,
        generator,
        flats,
        lift,
        car_parking,
        community_center,
        stair,
        cctv,
        security_guard,
        others_facilities = [],
        project_id,
        status = 1,
        id = 0
    ) {
        this.id = id;
        this.unit = unit;
        this.floors = floors;
        this.generator = generator;
        this.flats = flats;
        this.lift = lift;
        this.car_parking = car_parking;
        this.community_center = community_center;
        this.stair = stair;
        this.cctv = cctv;
        this.security_guard = security_guard;
        this.others_facilities = others_facilities;
        this.project_id = project_id;
        this.status = status;
    }

    async save(callback) {
        ProjectOverviewModel.getAllOverview((overviews) => {
            if (this.id > 0) {
                overviews = overviews.map((el) =>
                    el.id === this.id ? this : el
                );
            } else {
                this.id = overviews.length + 1;
                overviews.push(this);
                callback({ id: this.id });
            }

            const updatedData = overviews.map((el) => [
                el.id,
                el.unit,
                el.floors,
                el.generator,
                el.flats,
                el.lift,
                el.car_parking,
                el.community_center,
                el.stair,
                el.cctv,
                el.security_guard,
                JSON.stringify(el.others_facilities),
                el.project_id,
                el.status,
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

    static async getAllOverview(callback) {
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
                    const el = rows
                        ? rows.map((row) => ({
                              id: parseInt(row[0], 10),
                              unit: row[1],
                              floors: row[2],
                              generator: row[3],
                              flats: row[4],
                              lift: row[5],
                              car_parking: row[6],
                              community_center: row[7],
                              stair: row[8],
                              cctv: row[9],
                              security_guard: row[10],
                              others_facilities: JSON.parse(row[11] || "[]"),
                              project_id: row[12],
                              status: parseInt(row[13]),
                          }))
                        : [];
                    callback(el);
                }
            }
        );
    }

    static async overviewFindById(id, callback) {
        ProjectOverviewModel.getAllOverview((overviews) => {
            const el = overviews.find((el) => el.project_id == id) || null;
            callback(el);
        });
    }
};
