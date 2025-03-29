const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1jl_WJRdp1vd35GA9i9ea3mredt7gssxR-7W-muLSY6k";
const range = "Sheet1!A:I";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class OthersFacilitiesModel {
    constructor(
        lift,
        stair,
        generator,
        cctv,
        security_guard,
        others_facilities,
        project_id,
        status = 1,
        id = 0
    ) {
        this.id = id;
        this.lift = lift;
        this.stair = stair;
        this.generator = generator;
        this.cctv = cctv;
        this.security_guard = security_guard;
        this.others_facilities = others_facilities;
        this.project_id = project_id;
        this.status = status;
    }

    async save(callback) {
        OthersFacilitiesModel.getAllFacilities((facilities) => {
            if (this.id > 0) {
                facilities = facilities.map((el) =>
                    el.id === this.id ? this : el
                );
            } else {
                this.id = facilities.length + 1;
                facilities.push(this);
                callback({ id: this.id });
            }

            const updatedData = facilities.map((el) => [
                el.id,
                el.lift,
                el.stair,
                el.generator,
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

    static async getAllFacilities(callback) {
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
                              lift: row[1],
                              stair: row[2],
                              generator: row[3],
                              cctv: row[4],
                              security_guard: row[5],
                              others_facilities: JSON.parse(row[6] || "[]"),
                              project_id: row[7],
                              status: parseInt(row[8]),
                          }))
                        : [];
                    callback(el);
                }
            }
        );
    }

    static async facilitiesFindById(id, callback) {
        OthersFacilitiesModel.getAllFacilities((facilities) => {
            const el = facilities.find((el) => el.project_id == id) || null;
            callback(el);
        });
    }
};
