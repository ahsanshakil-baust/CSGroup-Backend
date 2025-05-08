// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1V3E3tP1x_c_88gNE972V_BXC8rpA63FbGAY_83rHhto";
// const range = "Sheet1!A:H";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class EducationModel {
//     constructor(
//         title,
//         profession,
//         institution,
//         about,
//         date_duration,
//         portfolio_id,
//         status = 1,
//         id = 0
//     ) {
//         this.id = id;
//         this.title = title;
//         this.profession = profession;
//         this.institution = institution;
//         this.about = about;
//         this.date_duration = date_duration;
//         this.portfolio_id = portfolio_id;
//         this.status = status;
//     }

//     save() {
//         EducationModel.getAllEducation((data) => {
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
//                 el.institution,
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

//     static getAllEducation(callback) {
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
//                               institution: row[3],
//                               about: row[4],
//                               date_duration: row[5],
//                               portfolio_id: row[6],
//                               status: parseInt(row[7]),
//                           }))
//                         : [];
//                     callback(event);
//                 }
//             }
//         );
//     }

//     // static educationFindById(id, callback) {
//     //     EducationModel.getAllEducation((events) => {
//     //         const el = events.find((el) => el.portfolio_id == id);
//     //         callback(el);
//     //     });
//     // }

//     static educationFindById(id, callback) {
//         return new Promise((resolve, reject) => {
//             EducationModel.getAllEducation((education) => {
//                 if (!education) return reject(new Error("No Education found"));
//                 const el =
//                     education.filter((el) => el.portfolio_id == id) || null;
//                 resolve(el);
//             });
//         });
//     }

//     static educationById(id, callback) {
//         return new Promise((resolve, reject) => {
//             EducationModel.getAllEducation((education) => {
//                 if (!education) return reject(new Error("No Education found"));
//                 const el = education.find((el) => el.id == id) || null;
//                 resolve(el);
//             });
//         });
//     }
// };

// EducationModel.js
// const db = require("./firebase2");
const db = apps.app2.firestore();
const collectionName = "education";

module.exports = class EducationModel {
    constructor(
        title,
        profession,
        institution,
        about,
        date_duration,
        portfolio_id,
        status = 1,
        id = null
    ) {
        this.id = id;
        this.title = title;
        this.profession = profession;
        this.institution = institution;
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
            console.log("Education saved successfully to Firebase.");
        } catch (error) {
            console.error("Error saving education:", error);
        }
    }

    static async getAllEducation(callback) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const data = snapshot.docs.map((doc) => doc.data());
            callback(data);
        } catch (error) {
            console.error("Error fetching education entries:", error);
            callback([]);
        }
    }

    static async educationFindByPortfolioId(portfolio_id) {
        try {
            const snapshot = await db
                .collection(collectionName)
                .where("portfolio_id", "==", portfolio_id)
                .get();

            const data = snapshot.docs.map((doc) => doc.data());
            return data;
        } catch (error) {
            console.error("Error finding education by portfolio_id:", error);
            return [];
        }
    }

    static async educationById(id) {
        try {
            const doc = await db
                .collection(collectionName)
                .doc(id.toString())
                .get();

            if (!doc.exists) throw new Error("No Education entry found");
            return doc.data();
        } catch (error) {
            console.error("Error finding education by ID:", error);
            return null;
        }
    }

    static async deleteById(id) {
        try {
            await db.collection(collectionName).doc(id.toString()).delete();
            console.log(`Education with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting education with ID ${id}:`, error);
        }
    }
};
