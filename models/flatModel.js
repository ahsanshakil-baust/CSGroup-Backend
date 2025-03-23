const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1WtQh01SeRDPgvU2JL9ceJ1BmT0s2yImarXAI4g08pRI";
const range = "Sheet1!A:Y";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class FlatModel {
    constructor(
        flat_number,
        floor,
        address,
        direction,
        bedrooms,
        drawing,
        dining,
        bathrooms,
        balconies,
        kitchen,
        lift,
        stair,
        generator,
        cctv,
        security_guard,
        others_facilities = [],
        flat_images = [],
        feature_images = [],
        flat_videos = [],
        completion_status,
        project_id,
        land_details_id,
        owner_id,
        status = 1,
        id = 0
    ) {
        this.id = id;
        this.flat_number = flat_number;
        this.floor = floor;
        this.address = address;
        this.direction = direction;
        this.bedrooms = bedrooms;
        this.drawing = drawing;
        this.dining = dining;
        this.bathrooms = bathrooms;
        this.balconies = balconies;
        this.kitchen = kitchen;
        this.lift = lift;
        this.stair = stair;
        this.generator = generator;
        this.cctv = cctv;
        this.security_guard = security_guard;
        this.others_facilities = others_facilities;
        this.flat_images = flat_images;
        this.feature_images = feature_images;
        this.flat_videos = flat_videos;
        this.completion_status = completion_status;
        this.project_id = project_id;
        this.land_details_id = land_details_id;
        this.owner_id = owner_id;
        this.status = status;
    }

    async save() {
        FlatModel.getAllFlat((flats) => {
            if (this.id > 0) {
                flats = flats.map((review) =>
                    review.id === this.id ? this : review
                );
            } else {
                this.id = flats.length + 1;
                flats.push(this);
            }

            const updatedData = flats.map((flat) => [
                flat.id,
                flat.flat_number,
                flat.floor,
                flat.address,
                flat.direction,
                flat.bedrooms,
                flat.drawing,
                flat.dining,
                flat.bathrooms,
                flat.balconies,
                flat.kitchen,
                flat.lift,
                flat.stair,
                flat.generator,
                flat.cctv,
                flat.security_guard,
                JSON.stringify(flat.others_facilities),
                JSON.stringify(flat.flat_images),
                JSON.stringify(flat.feature_images),
                JSON.stringify(flat.flat_videos),
                flat.completion_status,
                flat.project_id,
                flat.land_details_id,
                flat.owner_id,
                flat.status,
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

    static async getAllFlat(callback) {
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
                    const flat = rows
                        ? rows.map((row) => ({
                              d: parseInt(row[0], 10),
                              flat_number: row[1],
                              floor: row[2],
                              address: row[3],
                              direction: row[4],
                              bedrooms: row[5],
                              drawing: row[6],
                              dining: row[7],
                              bathrooms: row[8],
                              balconies: row[9],
                              kitchen: row[10],
                              lift: row[11],
                              stair: row[12],
                              generator: row[13],
                              cctv: row[14],
                              security_guard: row[15],
                              others_facilities: JSON.parse(row[16] || "[]"),
                              flat_images: JSON.parse(row[17] || "[]"),
                              feature_images: JSON.parse(row[18] || "[]"),
                              flat_videos: JSON.parse(row[19] || "[]"),
                              completion_status: row[20],
                              project_id: row[21],
                              land_details_id: row[22],
                              owner_id: row[23],
                              status: parseInt(row[24], 10),
                          }))
                        : [];
                    callback(flat);
                }
            }
        );
    }

    static async flatFindById(id) {
        const flats = await FlatModel.getAllFlat();
        return flats.find((flat) => flat.id === id) || null;
    }
};
