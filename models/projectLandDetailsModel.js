// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "18JQuTKmCnVBaHezY9qHeGrzvQ0uOxY0LSPsFBcy5ihU";
// const range = "Sheet1!A:G";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ProjectLandDetailsModel {
//     constructor(
//         area,
//         building_height,
//         total_share,
//         total_sqf,
//         project_id,
//         status = 1,
//         id = 0
//     ) {
//         this.id = id;
//         this.area = area;
//         this.building_height = building_height;
//         this.total_share = total_share;
//         this.total_sqf = total_sqf;
//         this.project_id = project_id;
//         this.status = status;
//     }

//     async save(callback) {
//         ProjectLandDetailsModel.getAllProjectLand((pLands) => {
//             if (this.id > 0) {
//                 pLands = pLands.map((el) => (el.id === this.id ? this : el));
//             } else {
//                 this.id = pLands.length + 1;
//                 pLands.push(this);
//             }
//             callback({ id: this.id });

//             const updatedData = pLands.map((el) => [
//                 el.id,
//                 el.area,
//                 el.building_height,
//                 el.total_share,
//                 el.total_sqf,
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

//     static async getAllProjectLand(callback) {
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
//                               area: row[1],
//                               building_height: row[2],
//                               total_share: row[3],
//                               total_sqf: row[4],
//                               project_id: row[5],
//                               status: parseInt(row[6]),
//                           }))
//                         : [];
//                     callback(el);
//                 }
//             }
//         );
//     }

//     // static async projectLandFindById(id, callback) {
//     //     ProjectLandDetailsModel.getAllProjectLand((pLands) => {
//     //         const el = pLands.find((el) => el.project_id == id) || null;
//     //         callback(el);
//     //     });
//     // }

//     static async projectLandFindById(id) {
//         return new Promise((resolve, reject) => {
//             ProjectLandDetailsModel.getAllProjectLand((pLands) => {
//                 if (!pLands)
//                     return reject(new Error("No project land details found"));

//                 const el = pLands.filter(
//                     (el) => parseInt(el.project_id) == parseInt(id)
//                 );

//                 resolve(el[0]);
//             });
//         });
//     }
// };

// const db = require("./firebase");
const db = apps.app3.firestore();
const collectionName = "projectLandDetails";

module.exports = class ProjectLandDetailsModel {
    constructor(
        area,
        building_height,
        total_share,
        total_sqf,
        project_id,
        status = 1,
        id = null
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
        try {
            let docRef;

            if (this.id) {
                docRef = db.collection(collectionName).doc(this.id.toString());
                await docRef.set({ ...this });
            } else {
                docRef = await db.collection(collectionName).add({ ...this });
                this.id = docRef.id;
                await docRef.update({ id: this.id });
            }

            if (callback) callback({ id: this.id });

            console.log("Project Land Details saved to Firebase.");
        } catch (error) {
            console.error("Error saving project land details:", error);
        }
    }

    static async getAllProjectLand(callback) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const data = snapshot.docs.map((doc) => doc.data());
            callback(data);
        } catch (error) {
            console.error("Error fetching project land details:", error);
            callback([]);
        }
    }

    static async projectLandFindById(projectId) {
        try {
            const snapshot = await db
                .collection(collectionName)
                .where("project_id", "==", projectId)
                .get();

            if (snapshot.empty) return null;

            // Assuming only one land detail per project
            return snapshot.docs[0].data();
        } catch (error) {
            console.error("Error finding project land by ID:", error);
            return null;
        }
    }
};
