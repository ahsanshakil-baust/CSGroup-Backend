// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1ClZWI11Evd1pAkr52DhwJ0sL7ya60SlN_q_vC8K5VRo";
// const range = "Sheet1!A:I";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class OthersFacilitiesModel {
//     constructor(
//         lift,
//         stair,
//         generator,
//         cctv,
//         security_guard,
//         others_facilities,
//         project_id,
//         status = 1,
//         id = 0
//     ) {
//         this.id = id;
//         this.lift = lift;
//         this.stair = stair;
//         this.generator = generator;
//         this.cctv = cctv;
//         this.security_guard = security_guard;
//         this.others_facilities = others_facilities;
//         this.project_id = project_id;
//         this.status = status;
//     }

//     async save(callback) {
//         OthersFacilitiesModel.getAllFacilities((facilities) => {
//             if (this.id > 0) {
//                 facilities = facilities.map((el) =>
//                     el.id === this.id ? this : el
//                 );
//             } else {
//                 this.id = facilities.length + 1;
//                 facilities.push(this);
//                 callback({ id: this.id });
//             }

//             const updatedData = facilities.map((el) => [
//                 el.id,
//                 el.lift,
//                 el.stair,
//                 el.generator,
//                 el.cctv,
//                 el.security_guard,
//                 JSON.stringify(el.others_facilities),
//                 el.project_id,
//                 el.status,
//             ]);

//             sheets.spreadsheets.values.update(
//                 {
//                     spreadsheetId: sheetId,
//                     range: range,
//                     valueInputOption: "RAW",
//                     requestBody: { values: updatedData },
//                 },
//                 (err, res) => {
//                     if (err) {
//                         console.error(
//                             "Error saving data to Google Sheets:",
//                             err
//                         );
//                     } else {
//                         console.log(
//                             "Data saved successfully to Google Sheets!"
//                         );
//                     }
//                 }
//             );
//         });
//     }

//     static async getAllFacilities(callback) {
//         sheets.spreadsheets.values.get(
//             {
//                 spreadsheetId: sheetId,
//                 range: range,
//             },
//             (err, res) => {
//                 if (err) {
//                     console.error("Error reading from Google Sheets:", err);
//                     callback([]);
//                 } else {
//                     const rows = res.data.values;
//                     const el = rows
//                         ? rows.map((row) => ({
//                               id: parseInt(row[0], 10),
//                               lift: row[1],
//                               stair: row[2],
//                               generator: row[3],
//                               cctv: row[4],
//                               security_guard: row[5],
//                               others_facilities: JSON.parse(row[6] || "[]"),
//                               project_id: row[7],
//                               status: parseInt(row[8]),
//                           }))
//                         : [];
//                     callback(el);
//                 }
//             }
//         );
//     }

//     static async facilitiesFindById(id, callback) {
//         OthersFacilitiesModel.getAllFacilities((facilities) => {
//             const el = facilities.find((el) => el.project_id == id) || null;
//             callback(el);
//         });
//     }
// };

// const db = require("./firebase");
const db = apps.app1.firestore();

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
        try {
            const facilitiesRef = db
                .collection("other_facilities")
                .doc(String(this.project_id));

            if (this.id === 0) {
                this.id = Date.now(); // Use timestamp for unique ID if not provided
            }

            await facilitiesRef.set({
                lift: this.lift,
                stair: this.stair,
                generator: this.generator,
                cctv: this.cctv,
                security_guard: this.security_guard,
                others_facilities: this.others_facilities,
                project_id: this.project_id,
                status: this.status,
            });

            console.log("Data saved successfully to Firestore!");
            callback({ id: this.id });
        } catch (err) {
            console.error("Error saving data to Firestore:", err);
        }
    }

    static async getAllFacilities(callback) {
        try {
            const snapshot = await db.collection("other_facilities").get();
            const facilities = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            callback(facilities);
        } catch (err) {
            console.error("Error reading from Firestore:", err);
            callback([]);
        }
    }

    static async facilitiesFindById(id, callback) {
        try {
            const doc = await db.collection("other_facilities").doc(id).get();
            if (doc.exists) {
                callback(doc.data());
            } else {
                callback(null);
            }
        } catch (err) {
            console.error("Error fetching data from Firestore:", err);
            callback(null);
        }
    }
};
