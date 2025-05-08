// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1LeyJ4rvY7Vudw6zCJIzQAeRNIrTBHlTASgMfZQck1us";
// const range = "Sheet1!A:E";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ContactModel {
//     constructor(address, phone, email, whour, map) {
//         this.address = address;
//         this.phone = phone;
//         this.email = email;
//         this.whour = whour;
//         this.map = map;
//     }

//     save() {
//         sheets.spreadsheets.values.update(
//             {
//                 spreadsheetId: sheetId,
//                 range: range,
//                 valueInputOption: "RAW",
//                 requestBody: {
//                     values: [
//                         [
//                             this.address,
//                             this.phone,
//                             this.email,
//                             this.whour,
//                             this.map,
//                         ],
//                     ],
//                 },
//             },
//             (err, res) => {
//                 if (err) {
//                     console.error("Error saving data to Google Sheets:", err);
//                 } else {
//                     console.log(
//                         "Certificate saved successfully to Google Sheets!"
//                     );
//                 }
//             }
//         );
//     }

//     static getContact(callback) {
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
//                             address: rows[0][0] || "",
//                             phone: rows[0][1] || "",
//                             email: rows[0][2] || "",
//                             whour: rows[0][3] || "",
//                             map: rows[0][4] || "",
//                         });
//                     } else {
//                         callback({});
//                     }
//                 }
//             }
//         );
//     }
// };

// ContactModel.js
// const db = require("./firebase");

const db = apps.app1.firestore();

module.exports = class ContactModel {
    constructor(address, phone, email, whour, map) {
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.whour = whour;
        this.map = map;
    }

    async save() {
        const contactRef = db.collection("contacts").doc("contactInfo");

        try {
            await contactRef.set({
                address: this.address,
                phone: this.phone,
                email: this.email,
                whour: this.whour,
                map: this.map,
            });
            console.log("Contact saved successfully to Firestore!");
        } catch (err) {
            console.error("Error saving contact to Firestore:", err);
        }
    }

    static async getContact(callback) {
        const contactRef = db.collection("contacts").doc("contactInfo");

        try {
            const doc = await contactRef.get();
            if (doc.exists) {
                const data = doc.data();
                callback({
                    address: data.address || "",
                    phone: data.phone || "",
                    email: data.email || "",
                    whour: data.whour || "",
                    map: data.map || "",
                });
            } else {
                callback({});
            }
        } catch (err) {
            console.error("Error reading contact from Firestore:", err);
            callback({});
        }
    }
};
