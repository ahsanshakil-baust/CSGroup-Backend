// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "12ZuR4kgLRooMHw0R9Ud8J7Qf6mxhrn-13yTeUc0cca8";
// const range = "Sheet1!A1:B";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class Advertisement {
//     constructor(type, url) {
//         this.type = type;
//         this.url = url;
//     }

//     save() {
//         sheets.spreadsheets.values.update(
//             {
//                 spreadsheetId: sheetId,
//                 range: range,
//                 valueInputOption: "RAW",
//                 requestBody: {
//                     values: [[this.type, this.url]],
//                 },
//             },
//             (err, res) => {
//                 if (err) {
//                     console.error("Error saving data to Google Sheets:", err);
//                 } else {
//                     console.log("Data saved successfully to Google Sheets!");
//                 }
//             }
//         );
//     }

//     static getAds(callback) {
//         sheets.spreadsheets.values.get(
//             {
//                 spreadsheetId: sheetId,
//                 range: range,
//             },
//             (err, res) => {
//                 if (err) {
//                     console.error("Error reading from Google Sheets:", err);
//                     callback({});
//                 } else {
//                     const rows = res.data.values;

//                     if (rows && rows.length) {
//                         callback({
//                             type: rows[0][0] || "",
//                             url: rows[0][1] || "",
//                         });
//                     } else {
//                         callback({ type: "", url: "" });
//                     }
//                 }
//             }
//         );
//     }
// };

// Advertisement.js
const db = require("./firebase");

module.exports = class Advertisement {
  constructor(type, url) {
    this.type = type;
    this.url = url;
  }

  async save() {
    const adsRef = db.collection("advertisements");

    try {
      // Check if there is already an ad stored
      const snapshot = await adsRef.get();

      if (snapshot.empty) {
        // If no ad exists, add the first one
        await adsRef.add({
          type: this.type,
          url: this.url,
        });
        console.log("Advertisement added to Firestore!");
      } else {
        // If ad exists, update it
        const doc = snapshot.docs[0];
        await adsRef.doc(doc.id).set({
          type: this.type,
          url: this.url,
        });
        console.log("Advertisement updated in Firestore!");
      }
    } catch (err) {
      console.error("Error saving advertisement to Firestore:", err);
    }
  }

  static async getAds(callback) {
    const adsRef = db.collection("advertisements");

    try {
      const snapshot = await adsRef.get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0].data();
        callback({
          type: doc.type || "",
          url: doc.url || "",
        });
      } else {
        callback({ type: "", url: "" });
      }
    } catch (err) {
      console.error("Error reading advertisement from Firestore:", err);
      callback({ type: "", url: "" });
    }
  }
};
