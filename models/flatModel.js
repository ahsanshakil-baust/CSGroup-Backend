const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1WtQh01SeRDPgvU2JL9ceJ1BmT0s2yImarXAI4g08pRI";
const range = "Sheet1!A:W";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class FlatModel {
    constructor(
        type,
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
        flat_images = [],
        feature_images = [],
        flat_videos = [],
        completion_status,
        project_id,
        land_details_id,
        city,
        room_type,
        description,
        serial_no,
        status = 1,
        id = 0
    ) {
        this.id = id;
        this.type = type;
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
        this.flat_images = flat_images;
        this.feature_images = feature_images;
        this.flat_videos = flat_videos;
        this.completion_status = completion_status;
        this.project_id = project_id;
        this.land_details_id = land_details_id;
        this.city = city;
        this.room_type = room_type;
        this.description = description;
        this.serial_no = serial_no;
        this.status = status;
    }

    async save(callback) {
        FlatModel.getAllFlat((flats) => {
            if (this.id > 0) {
                flats = flats.map((flat) =>
                    flat.id === this.id ? this : flat
                );
            } else {
                this.id = flats.length + 1;
                flats.push(this);
                callback({ id: this.id });
            }

            const updatedData = flats.map((flat) => [
                flat.id,
                flat.type,
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
                JSON.stringify(flat.flat_images),
                JSON.stringify(flat.feature_images),
                JSON.stringify(flat.flat_videos),
                flat.completion_status,
                flat.project_id,
                flat.land_details_id,
                flat.city,
                flat.room_type,
                flat.description,
                flat.serial_no,
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
                              id: parseInt(row[0], 10),
                              type: row[1],
                              flat_number: row[2],
                              floor: row[3],
                              address: row[4],
                              direction: row[5],
                              bedrooms: row[6],
                              drawing: row[7],
                              dining: row[8],
                              bathrooms: row[9],
                              balconies: row[10],
                              kitchen: row[11],
                              flat_images: JSON.parse(row[12] || "[]"),
                              feature_images: JSON.parse(row[13] || "[]"),
                              flat_videos: JSON.parse(row[14] || "[]"),
                              completion_status: row[15],
                              project_id: row[16],
                              land_details_id: row[17],
                              city: row[18],
                              room_type: row[19],
                              description: row[20],
                              serial_no: row[21],
                              status: parseInt(row[22]),
                          }))
                        : [];
                    callback(flat);
                }
            }
        );
    }

    // static async flatFindById(id, callback) {
    //     FlatModel.getAllFlat((flats) => {
    //         const flat = flats.find((flat) => flat.id === id) || null;
    //         callback(flat);
    //     });
    // }

    // static flatIdByProjectFloor(id, floor, callback) {
    //     FlatModel.getAllFlat((flats) => {
    //         const flat = flats.filter(
    //             (flat) => flat.project_id == id && flat.floor == floor
    //         );
    //         const newData = [];

    //         flat.forEach((el) =>
    //             newData.push({ id: el.id, serial_no: el.serial_no })
    //         );

    //         callback(newData);
    //     });
    // }

    // static async projectFindById(id) {
    //     return new Promise((resolve, reject) => {
    //         ProjectModel.getAllProjects((projects) => {
    //             if (!projects) return reject(new Error("No projects found"));
    //             const project = projects.find((p) => p.id === id) || null;
    //             resolve(project);
    //         });
    //     });
    // }

    static async flatFindById(id) {
        return new Promise((resolve, reject) => {
            FlatModel.getAllFlat((flats) => {
                if (!flats) return reject(new Error("No flats found"));

                const flat = flats.find((flat) => flat.id === id) || null;
                resolve(flat);
            });
        });
    }

    // static async flatIdByProjectFloor(id, floor) {
    //     return new Promise((resolve, reject) => {
    //         FlatModel.getAllFlat((flats) => {
    //             if (!flats) return reject(new Error("No flats found"));

    //             const newData = flats
    //                 .filter(
    //                     (flat) => flat.project_id == id && flat.floor == floor
    //                 )
    //                 .map(({ id, serial_no }) => ({ id, serial_no }));

    //             resolve(newData);
    //         });
    //     });
    // }

    static async flatIdByProjectFloor(id, floor) {
        return new Promise((resolve, reject) => {
            FlatModel.getAllFlat((flats) => {
                if (!flats) return reject(new Error("No flats found"));

                // Filter and sort in a single pass
                const newData = flats
                    .filter(
                        (flat) => flat.project_id == id && flat.floor == floor
                    ) // Filter flats by project_id and floor
                    .map(({ id, serial_no, room_type }) => ({
                        id,
                        serial_no,
                        room_type,
                    })) // Map to only the necessary properties
                    .sort((a, b) => a.serial_no - b.serial_no); // Sort by serial_no numerically

                resolve(newData);
            });
        });
    }
};
