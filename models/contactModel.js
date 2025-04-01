const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1iCTjyQytfnPrTcC_vGPbY_c8HOaoyqj2naO_0JZ0EZY";
const range = "Sheet1!A:E";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class ContactModel {
    constructor(address, phone, email, whour, map) {
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.whour = whour;
        this.map = map;
    }

    save() {
        sheets.spreadsheets.values.update(
            {
                spreadsheetId: sheetId,
                range: range,
                valueInputOption: "RAW",
                requestBody: {
                    values: [
                        [
                            this.address,
                            this.phone,
                            this.email,
                            this.whour,
                            this.map,
                        ],
                    ],
                },
            },
            (err, res) => {
                if (err) {
                    console.error("Error saving data to Google Sheets:", err);
                } else {
                    console.log(
                        "Certificate saved successfully to Google Sheets!"
                    );
                }
            }
        );
    }

    static getContact(callback) {
        sheets.spreadsheets.values.get(
            {
                spreadsheetId: sheetId,
                range: range,
            },
            (err, res) => {
                if (err) {
                    console.error("Error reading from Google Sheets:", err);
                    callback({});
                } else {
                    const rows = res.data.values;
                    if (rows && rows.length) {
                        callback({
                            address: rows[0][0] || "",
                            phone: rows[0][1] || "",
                            email: rows[0][2] || "",
                            whour: rows[0][3] || "",
                            map: rows[0][4] || "",
                        });
                    } else {
                        callback({});
                    }
                }
            }
        );
    }
};
