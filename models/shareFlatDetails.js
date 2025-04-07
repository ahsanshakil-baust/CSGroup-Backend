const { google } = require("googleapis");

const credentials = require("./credentials.json");
const sheetId = "1VgOPUqkFxZNIfC5HYBJIW2l3hOYmKqJgI6vKRibK3Mw";
const range = "Sheet1!A:M";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class ShareFlatModel {
    constructor(
        bedrooms,
        bathrooms,
        balconies,
        drawing,
        dining,
        kitchen,
        lift,
        stair,
        cctv,
        generator,
        share_id,
        status = 1,
        id = 0
    ) {
        this.id = id;
        this.bedrooms = bedrooms;
        this.bathrooms = bathrooms;
        this.balconies = balconies;
        this.drawing = drawing;
        this.dining = dining;
        this.kitchen = kitchen;
        this.lift = lift;
        this.stair = stair;
        this.cctv = cctv;
        this.generator = generator;
        this.share_id = share_id;
        this.status = status;
    }

    async save(callback) {
        ShareFlatModel.getAllShareFlat((flats) => {
            if (this.id > 0) {
                flats = flats.map((el) => (el.id === this.id ? this : el));
            } else {
                this.id = flats.length + 1;
                flats.push(this);
            }
            callback({ id: this.id });

            const updatedData = flats.map((el) => [
                el.id,
                el.bedrooms,
                el.bathrooms,
                el.balconies,
                el.drawing,
                el.dining,
                el.kitchen,
                el.lift,
                el.stair,
                el.cctv,
                el.generator,
                el.share_id,
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

    static async getAllShareFlat(callback) {
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
                              bedrooms: row[1],
                              bathrooms: row[2],
                              balconies: row[3],
                              drawing: row[4],
                              dining: row[5],
                              kitchen: row[6],
                              lift: row[7],
                              stair: row[8],
                              cctv: row[9],
                              generator: row[10],
                              share_id: row[11],
                              status: parseInt(row[12]),
                          }))
                        : [];
                    callback(el);
                }
            }
        );
    }

    static async shareFlatFindById(id) {
        return new Promise((resolve, reject) => {
            ShareFlatModel.getAllShareFlat((flats) => {
                if (!flats) return reject(new Error("No overview data found"));

                const el =
                    flats.find(
                        (el) => parseInt(el.share_id) === parseInt(id)
                    ) || null;
                resolve(el);
            });
        });
    }
};
