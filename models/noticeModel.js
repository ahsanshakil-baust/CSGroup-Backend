// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1e1M7PECBEC0Mu9h7THbCVwjAqB1918tSAqAAcUm86lA";
// const range = "Sheet1!A:H";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class NoticeModel {
//   constructor(
//     title,
//     url,
//     date,
//     type,
//     text = "",
//     signatory,
//     status = 1,
//     id = 0
//   ) {
//     this.id = id;
//     this.title = title;
//     this.url = url;
//     this.date = date;
//     this.type = type;
//     this.text = text;
//     this.signatory = signatory;
//     this.status = status;
//   }

//   save() {
//     NoticeModel.getAllNotice((data) => {
//       if (this.id > 0) {
//         data = data.map((el) => (el.id == this.id ? this : el));
//       } else {
//         this.id = data.length + 1;
//         data.push(this);
//       }

//       const updatedData = data.map((el) => [
//         el.id,
//         el.title,
//         el.url,
//         el.date,
//         el.type,
//         el.text,
//         el.signatory,
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
//             console.log("Notice saved successfully to Google Sheets!");
//           }
//         }
//       );
//     });
//   }

//   static getAllNotice(callback) {
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
//           const notice = rows
//             ? rows.map((row) => ({
//                 id: parseInt(row[0], 10),
//                 title: row[1],
//                 url: row[2],
//                 date: row[3],
//                 type: row[4],
//                 text: row[5],
//                 signatory: row[6],
//                 status: parseInt(row[7]),
//               }))
//             : [];
//           callback(notice);
//         }
//       }
//     );
//   }

//   static noticeFindById(id, callback) {
//     NoticeModel.getAllNotice((notices) => {
//       const el = notices.find((el) => el.id === id);
//       callback(el);
//     });
//   }
// };

// const db = require("./firebase");
const db = apps.app1.firestore();
const collectionName = "notices";

module.exports = class NoticeModel {
    constructor(
        title,
        url,
        date,
        type,
        text = "",
        signatory,
        status = 1,
        id = null
    ) {
        this.id = id;
        this.title = title;
        this.url = url;
        this.date = date;
        this.type = type;
        this.text = text;
        this.signatory = signatory;
        this.status = status;
    }

    async save() {
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

            console.log("Notice saved to Firebase.");
        } catch (error) {
            console.error("Error saving notice to Firebase:", error);
        }
    }

    static async getAllNotice(callback) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const notices = snapshot.docs.map((doc) => doc.data());
            callback(notices);
        } catch (error) {
            console.error("Error retrieving notices from Firebase:", error);
            callback([]);
        }
    }

    static async noticeFindById(id, callback) {
        try {
            const doc = await db
                .collection(collectionName)
                .doc(id.toString())
                .get();
            if (!doc.exists) {
                callback(null);
            } else {
                callback(doc.data());
            }
        } catch (error) {
            console.error("Error finding notice by ID:", error);
            callback(null);
        }
    }

    static async deleteById(id) {
        try {
            await db.collection(collectionName).doc(id.toString()).delete();
            console.log(`Notice with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting notice with ID ${id}:`, error);
        }
    }
};
