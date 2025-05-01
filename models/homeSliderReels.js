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

module.exports = class HomeSliderReelsModel {
  constructor(title, url, status = 1, id = 0) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.status = status;
  }

  async save(callback) {
    const reelRef = db.collection("home_slider_reels").doc(String(this.id));

    try {
      await reelRef.set({
        title: this.title,
        url: this.url,
        status: this.status,
      });
      console.log("Reel saved successfully to Firestore!");
      callback({ id: this.id });
    } catch (err) {
      console.error("Error saving reel to Firestore:", err);
    }
  }

  static async getAllReels(callback) {
    const reelRef = db.collection("home_slider_reels");

    try {
      const snapshot = await reelRef.get();
      const reels = snapshot.docs.map((doc) => doc.data());
      callback(reels);
    } catch (err) {
      console.error("Error reading reels from Firestore:", err);
      callback([]);
    }
  }

  static async reelsFindById(id, callback) {
    const reelRef = db.collection("home_slider_reels").doc(String(id));

    try {
      const doc = await reelRef.get();
      if (doc.exists) {
        callback(doc.data());
      } else {
        callback(null);
      }
    } catch (err) {
      console.error("Error finding reel by ID:", err);
      callback(null);
    }
  }
};
