const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1C7rK7q5TSl7vc1kzuFORZOVK8XF5op19Uj8CLq_aSP4";
const range = "Sheet1!A:O";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class ShareLandDetailsModel {
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
        share_id,
        total_floor,
        total_flat,
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
        this.share_id = share_id;
        this.total_floor = total_floor;
        this.total_flat = total_flat;
        this.status = status;
    }

    save(callback) {
        ShareLandDetailsModel.getAllLandDetails((lands) => {
            if (this.id > 0) {
                lands = lands.map((land) => (land.id == this.id ? this : land));
            } else {
                this.id = lands.length + 1;
                lands.push(this);
            }
            callback({
                id: this.id,
                share_id: parseInt(this.share_id),
            });

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
                land.share_id,
                land.total_floor,
                land.total_flat,
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
                              share_id: row[11],
                              total_floor: row[12],
                              total_flat: row[13],
                              status: parseInt(row[14], 10),
                          }))
                        : [];

                    callback(land);
                }
            }
        );
    }

    static async landFindById(share_id) {
        return new Promise((resolve, reject) => {
            ShareLandDetailsModel.getAllLandDetails((lands) => {
                if (!lands) return reject(new Error("No land details found"));

                const land =
                    lands.find(
                        (land) => parseInt(land.share_id) == parseInt(share_id)
                    ) || null;

                resolve(land);
            });
        });
    }
};
