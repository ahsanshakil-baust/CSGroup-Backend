// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1y7GrWn2Eb5JFzkz_uZ4Xv0zN5_2k2ZK0-2-r4BaJpo4";
// const range = "Sheet1!A:G";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ExperienceModel {
//     constructor(
//         title,
//         profession,
//         about,
//         date_duration,
//         portfolio_id,
//         status = 1,
//         id = 0
//     ) {
//         this.id = id;
//         this.title = title;
//         this.profession = profession;
//         this.about = about;
//         this.date_duration = date_duration;
//         this.portfolio_id = portfolio_id;
//         this.status = status;
//     }

//     save() {
//         ExperienceModel.getAllExperience((data) => {
//             if (this.id > 0) {
//                 data = data.map((el) => (el.id == this.id ? this : el));
//             } else {
//                 this.id = data.length + 1;
//                 data.push(this);
//             }

//             const updatedData = data.map((el) => [
//                 el.id,
//                 el.title,
//                 el.profession,
//                 el.about,
//                 el.date_duration,
//                 el.portfolio_id,
//                 el.status,
//             ]);

//             sheets.spreadsheets.values.update(
//                 {
//                     spreadsheetId: sheetId,
//                     range: range,
//                     valueInputOption: "RAW",
//                     requestBody: {
//                         values: updatedData,
//                     },
//                 },
//                 (err, res) => {
//                     if (err) {
//                         console.error(
//                             "Error saving data to Google Sheets:",
//                             err
//                         );
//                     } else {
//                         console.log(
//                             "Certificate saved successfully to Google Sheets!"
//                         );
//                     }
//                 }
//             );
//         });
//     }

//     static getAllExperience(callback) {
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
//                     const event = rows
//                         ? rows.map((row) => ({
//                               id: parseInt(row[0], 10),
//                               title: row[1],
//                               profession: row[2],
//                               about: row[3],
//                               date_duration: row[4],
//                               portfolio_id: row[5],
//                               status: parseInt(row[6]),
//                           }))
//                         : [];
//                     callback(event);
//                 }
//             }
//         );
//     }

//     // static experienceFindById(id, callback) {
//     //     ExperienceModel.getAllExperience((events) => {
//     //         const el = events.find((el) => el.portfolio_id == id);
//     //         callback(el);
//     //     });
//     // }

//     static experienceFindById(id, callback) {
//         return new Promise((resolve, reject) => {
//             ExperienceModel.getAllExperience((experience) => {
//                 if (!experience)
//                     return reject(new Error("No Experience found"));
//                 const el =
//                     experience.filter((el) => el.portfolio_id == id) || null;
//                 resolve(el);
//             });
//         });
//     }

//     static experienceById(id, callback) {
//         return new Promise((resolve, reject) => {
//             ExperienceModel.getAllExperience((experience) => {
//                 if (!experience)
//                     return reject(new Error("No Experience found"));
//                 const el = experience.find((el) => el.id == id) || null;
//                 resolve(el);
//             });
//         });
//     }
// };

// ExperienceModel.js
// const db = require("./firebase2");
const db = apps.app2.firestore();
const collectionName = "experiences";

module.exports = class ExperienceModel {
    constructor(
        title,
        profession,
        about,
        date_duration,
        portfolio_id,
        status = 1,
        id = null
    ) {
        this.id = id;
        this.title = title;
        this.profession = profession;
        this.about = about;
        this.date_duration = date_duration;
        this.portfolio_id = portfolio_id;
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

            if (callback) callback(this.id);
            console.log("Experience saved successfully to Firebase.");
        } catch (error) {
            console.error("Error saving experience:", error);
        }
    }

    static async getAllExperience(callback) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const data = snapshot.docs.map((doc) => doc.data());
            callback(data);
        } catch (error) {
            console.error("Error fetching experiences:", error);
            callback([]);
        }
    }

    static async experienceFindByPortfolioId(portfolio_id) {
        try {
            const snapshot = await db
                .collection(collectionName)
                .where("portfolio_id", "==", portfolio_id)
                .get();

            const data = snapshot.docs.map((doc) => doc.data());
            return data;
        } catch (error) {
            console.error("Error finding experiences by portfolio_id:", error);
            return [];
        }
    }

    static async experienceById(id) {
        try {
            const doc = await db
                .collection(collectionName)
                .doc(id.toString())
                .get();

            if (!doc.exists) throw new Error("No Experience found");
            return doc.data();
        } catch (error) {
            console.error("Error finding experience by ID:", error);
            return null;
        }
    }

    static async deleteById(id) {
        try {
            await db.collection(collectionName).doc(id.toString()).delete();
            console.log(`Experience with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting experience with ID ${id}:`, error);
        }
    }
};
