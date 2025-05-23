// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1jIecqz5ahDB59hg3eISUvShB-u8p2oRTPvcjLizq6tQ";
// const range = "Sheet1!A:H";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class PortfolioModel {
//     constructor(
//         member_id,
//         profession,
//         url,
//         email,
//         phone,
//         about,
//         status = 1,
//         id = 0
//     ) {
//         this.id = id;
//         this.member_id = member_id;
//         this.profession = profession;
//         this.phone = phone;
//         this.url = url;
//         this.email = email;
//         this.about = about;
//         this.status = status;
//     }

//     save(callback) {
//         PortfolioModel.getAllPortfolio((data) => {
//             if (this.id > 0) {
//                 data = data.map((el) => (el.id == this.id ? this : el));
//             } else {
//                 this.id = data.length + 1;
//                 data.push(this);
//             }

//             callback(this.id);

//             const updatedData = data.map((el) => [
//                 el.id,
//                 el.member_id,
//                 el.profession,
//                 el.phone,
//                 el.url,
//                 el.email,
//                 el.about,
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

//     static getAllPortfolio(callback) {
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
//                               member_id: row[1],
//                               profession: row[2],
//                               phone: row[3],
//                               url: row[4],
//                               email: row[5],
//                               about: row[6],
//                               status: parseInt(row[7]),
//                           }))
//                         : [];
//                     callback(event);
//                 }
//             }
//         );
//     }

//     static portfolioFindById(id, callback) {
//         return new Promise((resolve, reject) => {
//             PortfolioModel.getAllPortfolio((portfolio) => {
//                 if (!portfolio) return reject(new Error("No Portfolio found"));
//                 const el = portfolio.find((el) => el.id == id) || null;
//                 resolve(el);
//             });
//         });
//     }
// };

// const db = require("./firebase");
const db = apps.app2.firestore();

const collectionName = "portfolios";

module.exports = class PortfolioModel {
    constructor(
        member_id,
        profession,
        url,
        email,
        phone,
        about,
        status = 1,
        id = null
    ) {
        this.id = id;
        this.member_id = member_id;
        this.profession = profession;
        this.phone = phone;
        this.url = url;
        this.email = email;
        this.about = about;
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
            console.log("Portfolio saved successfully to Firebase.");
        } catch (error) {
            console.error("Error saving portfolio:", error);
        }
    }

    static async getAllPortfolio(callback) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const data = snapshot.docs.map((doc) => doc.data());
            callback(data);
        } catch (error) {
            console.error("Error fetching portfolios:", error);
            callback([]);
        }
    }

    static async portfolioFindById(id) {
        try {
            const doc = await db
                .collection(collectionName)
                .doc(id.toString())
                .get();
            if (!doc.exists) throw new Error("No Portfolio found");
            return doc.data();
        } catch (error) {
            console.error("Error finding portfolio:", error);
            return null;
        }
    }

    static async deleteById(id) {
        try {
            await db.collection(collectionName).doc(id.toString()).delete();
            console.log(`Portfolio with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting portfolio with ID ${id}:`, error);
        }
    }
};
