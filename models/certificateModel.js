// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "1mUbEG2jWbTkGqdUDdo66ZZ2UBdfL98Tr9kS3grCX9EQ";
// const range = "Sheet1!A:F";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class CertificateModel {
//     constructor(title, where, url, date, status = 1, id = 0) {
//         this.id = id;
//         this.title = title;
//         this.where = where;
//         this.url = url;
//         this.date = date;
//         this.status = status;
//     }

//     save() {
//         CertificateModel.getAllCertificate((data) => {
//             if (this.id > 0) {
//                 data = data.map((el) => (el.id == this.id ? this : el));
//             } else {
//                 this.id = data.length + 1;
//                 data.push(this);
//             }

//             const updatedData = data.map((el) => [
//                 el.id,
//                 el.title,
//                 el.where,
//                 el.url,
//                 el.date,
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

//     static getAllCertificate(callback) {
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
//                               where: row[2],
//                               url: row[3],
//                               date: row[4],
//                               status: parseInt(row[5]),
//                           }))
//                         : [];
//                     callback(event);
//                 }
//             }
//         );
//     }

//     static certificateFindById(id, callback) {
//         CertificateModel.getAllCertificate((events) => {
//             const el = events.find((el) => el.id === id);
//             callback(el);
//         });
//     }
// };

// CertificateModel.js
const db = require("./firebase");

module.exports = class CertificateModel {
    constructor(title, where, url, date, status = 1, id = 0) {
        this.id = id;
        this.title = title;
        this.where = where;
        this.url = url;
        this.date = date;
        this.status = status;
    }

    async save() {
        const certificatesRef = db.collection("certificates");

        try {
            if (this.id > 0) {
                // Update existing certificate
                await certificatesRef.doc(this.id.toString()).set({
                    id: this.id,
                    title: this.title,
                    where: this.where,
                    url: this.url,
                    date: this.date,
                    status: this.status,
                });
                console.log("Certificate updated in Firestore!");
            } else {
                // Add new certificate
                const snapshot = await certificatesRef.get();
                this.id = snapshot.size + 1;

                await certificatesRef.doc(this.id.toString()).set({
                    id: this.id,
                    title: this.title,
                    where: this.where,
                    url: this.url,
                    date: this.date,
                    status: this.status,
                });
                console.log("Certificate added to Firestore!");
            }
        } catch (err) {
            console.error("Error saving certificate to Firestore:", err);
        }
    }

    static async getAllCertificate(callback) {
        const certificatesRef = db.collection("certificates");

        try {
            const snapshot = await certificatesRef.get();
            const certificates = [];
            snapshot.forEach((doc) => {
                certificates.push(doc.data());
            });
            callback(certificates);
        } catch (err) {
            console.error("Error reading certificates from Firestore:", err);
            callback([]);
        }
    }

    static async certificateFindById(id, callback) {
        const certificatesRef = db.collection("certificates");

        try {
            const doc = await certificatesRef.doc(id.toString()).get();
            if (doc.exists) {
                callback(doc.data());
            } else {
                callback(null);
            }
        } catch (err) {
            console.error("Error finding certificate by ID:", err);
            callback(null);
        }
    }

    static async deleteById(id) {
        try {
            await db.collection("certificates").doc(id.toString()).delete();
            console.log(`Certificate with ID ${id} deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting certificate with ID ${id}:`, error);
        }
    }
};
