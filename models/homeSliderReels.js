// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "1sFkTrFC_qgIpCPCHoR_xrwNsUyFIWJS89Gl_Nqyp2ko";
// const range = "Sheet1!A:D";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class HomeSliderReelsModel {
//   constructor(title, url, status = 1, id = 0) {
//     this.id = id;
//     this.title = title;
//     this.url = url;
//     this.status = status;
//   }

//   save() {
//     HomeSliderReelsModel.getAllReels((data) => {
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
//             console.log("Certificate saved successfully to Google Sheets!");
//           }
//         }
//       );
//     });
//   }

//   static getAllReels(callback) {
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
//                 url: row[2],
//                 status: parseInt(row[3]),
//               }))
//             : [];
//           callback(event);
//         }
//       }
//     );
//   }

//   static reelsFindById(id, callback) {
//     HomeSliderReelsModel.getAllReels((reels) => {
//       const el = reels.find((el) => el.id == id);
//       callback(el);
//     });
//   }
// };

const db = require("./firebase");
const collectionName = "home_slider_reels";

module.exports = class HomeSliderReelsModel {
  constructor(title, url, status = 1, id = null) {
    this.id = id;
    this.title = title;
    this.url = url;
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

      console.log("Reel saved to Firebase.");
    } catch (error) {
      console.error("Error saving reel to Firebase:", error);
    }
  }

  static async getAllReels(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const reels = snapshot.docs.map((doc) => doc.data());
      callback(reels);
    } catch (error) {
      console.error("Error retrieving reels from Firebase:", error);
      callback([]);
    }
  }

  static async reelsFindById(id, callback) {
    try {
      const doc = await db.collection(collectionName).doc(id.toString()).get();
      if (!doc.exists) {
        callback(null);
      } else {
        callback(doc.data());
      }
    } catch (error) {
      console.error("Error finding reel by ID:", error);
      callback(null);
    }
  }

  static async deleteById(id) {
    try {
      await db.collection(collectionName).doc(id.toString()).delete();
      console.log(`Reel with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting reel with ID ${id}:`, error);
    }
  }
};
