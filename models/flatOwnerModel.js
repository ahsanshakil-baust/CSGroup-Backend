const { google } = require("googleapis");

const credentials = require("./credentials2.json");
const sheetId = "1Jzzz3TXHS-jmeFXmXRVICrebdwy7y4VBLAiLyslZrDQ";
const range = "Sheet1!A:H";

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class OwnerModel {
    constructor(
        name,
        image,
        occupation,
        blood_group,
        p_address,
        mobile,
        id = 0,
        status = 1
    ) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.occupation = occupation;
        this.blood_group = blood_group;
        this.p_address = p_address;
        this.mobile = mobile;
        this.status = status;
    }

    save() {
        OwnerModel.getAllOwners((owners) => {
            if (this.id > 0) {
                owners = owners.map((owner) =>
                    owner.id == this.id ? this : owner
                );
            } else {
                this.id = owners.length + 1;
                owners.push(this);
            }

            const updatedData = owners.map((owner) => [
                owner.id,
                owner.name,
                owner.image,
                owner.occupation,
                owner.blood_group,
                owner.p_address,
                owner.mobile,
                owner.status,
            ]);

            sheets.spreadsheets.values.update(
                {
                    spreadsheetId: sheetId,
                    range: range,
                    valueInputOption: "RAW",
                    requestBody: { values: updatedData },
                },
                (err, res) => {
                    if (err) {
                        console.error(
                            "Error saving data to Google Sheets:",
                            err
                        );
                    } else {
                        console.log(
                            "Data saved successfully to Google Sheets!"
                        );
                    }
                }
            );
        });
    }

    static getAllOwners(callback) {
        sheets.spreadsheets.values.get(
            {
                spreadsheetId: sheetId,
                range: range,
            },
            (err, res) => {
                if (err) {
                    console.error("Error reading from Google Sheets:", err);
                    callback([]);
                } else {
                    const rows = res.data.values;
                    const owner = rows
                        ? rows.map((row) => ({
                              id: parseInt(row[0], 10),
                              name: row[1],
                              image: row[2],
                              occupation: row[3],
                              blood_group: row[4],
                              p_address: row[5],
                              mobile: row[6],
                              status: parseInt(row[7], 10),
                          }))
                        : [];

                    callback(owner);
                }
            }
        );
    }

    static async ownerFindById(id, calback) {
        OwnerModel.getAllOwners((owners) => {
            const owner = owners.find((owner) => owner.id === id) || null;
            calback(owner);
        });
    }
};
