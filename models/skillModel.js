// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1QyOOkgcEJQWwQHdV4gR8SCPizUZ4fN9OCTqot7csL2Q";
// const range = "Sheet1!A:D";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class SkillModel {
//   constructor(title, portfolio_id, status = 1, id = 0) {
//     this.id = id;
//     this.title = title;
//     this.portfolio_id = portfolio_id;
//     this.status = status;
//   }

//   save() {
//     SkillModel.getAllSkills((data) => {
//       if (this.id > 0) {
//         data = data.map((el) => (el.id == this.id ? this : el));
//       } else {
//         this.id = data.length + 1;
//         data.push(this);
//       }

//       const updatedData = data.map((el) => [
//         el.id,
//         el.title,
//         el.portfolio_id,
//         el.status,
//       ]);

//       sheets.spreadsheets.values.update(
//         {
//           spreadsheetId: sheetId,
//           range: range,
//           valueInputOption: "RAW",
//           requestBody: {
//             values: updatedData,
//           },
//         },
//         (err, res) => {
//           if (err) {
//             console.error("Error saving data to Google Sheets:", err);
//           } else {
//             console.log("Skill saved successfully to Google Sheets!");
//           }
//         }
//       );
//     });
//   }

//   static getAllSkills(callback) {
//     sheets.spreadsheets.values.get(
//       {
//         spreadsheetId: sheetId,
//         range: range,
//       },
//       (err, res) => {
//         if (err) {
//           console.error("Error reading from Google Sheets:", err);
//           callback([]);
//         } else {
//           const rows = res.data.values;

//           const event = rows
//             ? rows.map((row) => ({
//                 id: parseInt(row[0], 10),
//                 title: row[1],
//                 portfolio_id: row[2],
//                 status: parseInt(row[3]),
//               }))
//             : [];
//           callback(event);
//         }
//       }
//     );
//   }

//   static skillFindById(id, callback) {
//     return new Promise((resolve, reject) => {
//       SkillModel.getAllSkills((skills) => {
//         if (!skills) return reject(new Error("No Skills found"));
//         const el = skills.filter((el) => el.portfolio_id == id) || null;
//         resolve(el);
//       });
//     });
//   }

//   static skillById(id, callback) {
//     return new Promise((resolve, reject) => {
//       SkillModel.getAllSkills((skills) => {
//         if (!skills) return reject(new Error("No Skills found"));
//         const el = skills.find((el) => el.id == id) || null;
//         resolve(el);
//       });
//     });
//   }
// };

// const db = require("./firebase");
const db = apps.app2.firestore();
const collectionName = "skills";

module.exports = class SkillModel {
    constructor(title, portfolio_id, status = 1, id = null) {
        this.id = id;
        this.title = title;
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
            console.log("Skill saved successfully to Firebase.");
        } catch (error) {
            console.error("Error saving skill:", error);
        }
    }

    static async getAllSkills(callback) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const data = snapshot.docs.map((doc) => doc.data());
            callback(data);
        } catch (error) {
            console.error("Error fetching skills:", error);
            callback([]);
        }
    }

    static async skillFindByPortfolioId(portfolio_id) {
        try {
            const snapshot = await db
                .collection(collectionName)
                .where("portfolio_id", "==", portfolio_id)
                .get();

            const data = snapshot.docs.map((doc) => doc.data());
            return data;
        } catch (error) {
            console.error("Error finding skills by portfolio ID:", error);
            return [];
        }
    }

    static async skillById(id) {
        try {
            const doc = await db
                .collection(collectionName)
                .doc(id.toString())
                .get();

            if (!doc.exists) throw new Error("Skill not found");
            return doc.data();
        } catch (error) {
            console.error("Error finding skill by ID:", error);
            return null;
        }
    }

    static async deleteById(id) {
        try {
            await db.collection(collectionName).doc(id.toString()).delete();
            console.log(`Skill with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting skill with ID ${id}:`, error);
        }
    }
};
