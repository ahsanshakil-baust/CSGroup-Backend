const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1gLETd62O8HgGEIbRxkkDNOqeYFy0EPDXqKHt-n2nM9g";
const range = "Sheet1!A:G";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class ProjectLandDetailsModel {
    constructor(
        area,
        building_height,
        total_share,
        total_sqf,
        project_id,
        status = 1,
        id = 0
    ) {
        this.id = id;
        this.area = area;
        this.building_height = building_height;
        this.total_share = total_share;
        this.total_sqf = total_sqf;
        this.project_id = project_id;
        this.status = status;
    }

    async save(callback) {
        ProjectLandDetailsModel.getAllProjectLand((pLands) => {
            if (this.id > 0) {
                pLands = pLands.map((el) => (el.id === this.id ? this : el));
            } else {
                this.id = pLands.length + 1;
                pLands.push(this);
            }
            callback({ id: this.id });

            const updatedData = pLands.map((el) => [
                el.id,
                el.area,
                el.building_height,
                el.total_share,
                el.total_sqf,
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

    static async getAllProjectLand(callback) {
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
                              area: row[1],
                              building_height: row[2],
                              total_share: row[3],
                              total_sqf: row[4],
                              project_id: row[5],
                              status: parseInt(row[6]),
                          }))
                        : [];
                    callback(el);
                }
            }
        );
    }

    // static async projectLandFindById(id, callback) {
    //     ProjectLandDetailsModel.getAllProjectLand((pLands) => {
    //         const el = pLands.find((el) => el.project_id == id) || null;
    //         callback(el);
    //     });
    // }

    static async projectLandFindById(id) {
        return new Promise((resolve, reject) => {
            ProjectLandDetailsModel.getAllProjectLand((pLands) => {
                if (!pLands)
                    return reject(new Error("No project land details found"));

                const el = pLands.filter(
                    (el) => parseInt(el.project_id) == parseInt(id)
                );

                resolve(el[0]);
            });
        });
    }
};
