const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1HDJdQunkmaOQvO31cshisruP06_EPt-i6PPdyF7LcWY";
const range = "Sheet1!A:N";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class LandDetailsModel {
    constructor(
        area,
        building_height,
        total_share,
        total_sqf,
        net_sqf,
        price,
        reg_cost,
        khariz_cost,
        other_cost,
        total_price,
        project_id,
        id = 0,
        status = 1
    ) {
        this.id = id;
        this.area = area;
        this.building_height = building_height;
        this.total_share = total_share;
        this.total_sqf = total_sqf;
        this.net_sqf = net_sqf;
        this.price = price;
        this.reg_cost = reg_cost;
        this.khariz_cost = khariz_cost;
        this.other_cost = other_cost;
        this.total_price = total_price;
        this.project_id = project_id;
        this.status = status;
    }

    save(callback) {
        LandDetailsModel.getAllLandDetails((lands) => {
            if (this.id > 0) {
                lands = lands.map((land) => (land.id == this.id ? this : land));
            } else {
                this.id = lands.length + 1;
                lands.push(this);
                callback({
                    id: this.id,
                    project_id: parseInt(this.project_id),
                });
            }

            const updatedData = lands.map((land) => [
                land.id,
                land.area,
                land.building_height,
                land.total_share,
                land.total_sqf,
                land.net_sqf,
                land.price,
                land.reg_cost,
                land.khariz_cost,
                land.other_cost,
                land.total_price,
                land.project_id,
                land.status,
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

    static getAllLandDetails(callback) {
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
                    const land = rows
                        ? rows.map((row) => ({
                              id: parseInt(row[0], 10),
                              area: row[1],
                              building_height: row[2],
                              total_share: row[3],
                              total_sqf: row[4],
                              net_sqf: row[5],
                              price: row[6],
                              reg_cost: row[7],
                              khariz_cost: row[8],
                              other_cost: row[9],
                              total_price: row[10],
                              project_id: row[11],
                              status: parseInt(row[12], 10),
                          }))
                        : [];

                    callback(land);
                }
            }
        );
    }

    static async landFindById(id, project_id, flat_id, callback) {
        LandDetailsModel.getAllLandDetails((lands) => {
            const land =
                lands.find(
                    (land) =>
                        parseInt(land.id) === id &&
                        parseInt(land.project_id) === project_id
                ) || null;

            callback(land);
        });
    }
};
