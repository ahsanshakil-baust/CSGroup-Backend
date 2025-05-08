// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "12dUZQa2cONzfUuKJXvFRJjQWx3RUU3mr441bPvwkol4";
// const range = "Sheet1!A1";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class HomeSlidersText {
//   constructor(text) {
//     this.text = text;
//   }

//   save() {
//     const updatedData = [[this.text]];
//     sheets.spreadsheets.values.update(
//       {
//         spreadsheetId: sheetId,
//         range: range,
//         valueInputOption: "RAW",
//         requestBody: {
//           values: updatedData,
//         },
//       },
//       (err, res) => {
//         if (err) {
//           console.error("Error saving text to Google Sheets:", err);
//         } else {
//           console.log("Text saved successfully to Google Sheets!");
//         }
//       }
//     );
//   }

//   static getText(callback) {
//     sheets.spreadsheets.values.get(
//       {
//         spreadsheetId: sheetId,
//         range: range,
//       },
//       (err, res) => {
//         if (err) {
//           console.error("Error reading from Google Sheets:", err);
//           callback({ text: "" });
//         } else {
//           const rows = res.data.values;
//           if (rows && rows.length) {
//             callback({ text: rows[0][0] || "" });
//           } else {
//             callback({ text: "" });
//           }
//         }
//       }
//     );
//   }
// };

// const db = require("./firebase");
const db = apps.app1.firestore();

module.exports = class HomeSlidersText {
    constructor(text) {
        this.text = text;
    }

    async save() {
        try {
            const textRef = db.collection("home_slider_text").doc("text");
            await textRef.set({
                text: this.text,
            });
            console.log("Text saved successfully to Firestore!");
        } catch (err) {
            console.error("Error saving text to Firestore:", err);
        }
    }

    static async getText(callback) {
        try {
            const textRef = db.collection("home_slider_text").doc("text");
            const doc = await textRef.get();
            if (doc.exists) {
                callback({ text: doc.data().text });
            } else {
                callback({ text: "" });
            }
        } catch (err) {
            console.error("Error reading from Firestore:", err);
            callback({ text: "" });
        }
    }
};
