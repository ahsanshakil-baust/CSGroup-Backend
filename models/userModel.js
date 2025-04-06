// const fs = require("fs");
// const path = require("path");

// const rootDir = require("../utils/pathUtil");

// const userPath = path.join(rootDir, "data", "user.json");

// module.exports = class User {
//   constructor(name, email, password) {
//     this.id = 0;
//     this.name = name;
//     this.email = email;
//     this.password = password;
//   }

//   save() {
//     User.getAllUser((data) => {
//       if (this.id > 0) {
//         data = data.map((home) => {
//           if (home.id === this.id) {
//             return this;
//           }

//           return home;
//         });
//       } else {
//         this.id = data.length + 1;
//         data.push(this);
//       }
//       fs.writeFile(userPath, JSON.stringify(data), (err) => {
//         console.log("file writing...", err);
//       });
//     });
//   }

//   static getAllUser(callback) {
//     fs.readFile(userPath, (err, data) => {
//       if (!err) {
//         const parsedData = JSON.parse(data);
//         callback(parsedData);
//       } else callback([]);
//     });
//   }

//   static getUserByEmail(email, callback) {
//     User.getAllUser((user) => {
//       const userFound = user.find((el) => el.email === email);
//       if (userFound) {
//         callback({
//           id: userFound.id,
//           name: userFound.name,
//           email: userFound.email,
//         });
//       } else {
//         callback({ error: "No user Exist!" });
//       }
//     });
//   }

//   static deleteUserById(id, callback) {
//     User.getAllUser((user) => {
//       user = user.filter((el) => el.id !== id);
//       fs.writeFile(userPath, JSON.stringify(user), callback);
//     });
//   }
// };

const { google } = require("googleapis");
const credentials = require("./credentials2.json");

const sheetId = "1SQlLsyzVzVP2VeUWbCGsv-18DfHBTKRpsQKT51AKHcY";
const range = "Sheet1!A:E"; // Assuming columns: ID, Name, Email, Password

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

module.exports = class User {
    constructor(name, email, password, status = 0) {
        this.id = 0;
        this.name = name;
        this.email = email;
        this.password = password;
        this.status = status;
    }

    save() {
        User.getAllUser((users) => {
            if (this.id > 0) {
                users = users.map((user) =>
                    user.id === this.id ? this : user
                );
            } else {
                this.id = users.length + 1;
                users.push(this);
            }

            const updatedData = users.map((u) => [
                u.id,
                u.name,
                u.email,
                u.password,
                u.status,
            ]);

            sheets.spreadsheets.values.update(
                {
                    spreadsheetId: sheetId,
                    range: range,
                    valueInputOption: "RAW",
                    requestBody: { values: updatedData },
                },
                (err, res) => {
                    if (err)
                        console.error(
                            "Error saving user to Google Sheets:",
                            err
                        );
                    else
                        console.log(
                            "User saved successfully to Google Sheets!"
                        );
                }
            );
        });
    }

    static getAllUser(callback) {
        sheets.spreadsheets.values.get(
            {
                spreadsheetId: sheetId,
                range: range,
            },
            (err, res) => {
                if (err) {
                    console.error(
                        "Error reading users from Google Sheets:",
                        err
                    );
                    callback([]);
                } else {
                    const rows = res.data.values;
                    if (rows && rows.length) {
                        const users = rows.map((row) => ({
                            id: parseInt(row[0]),
                            name: row[1],
                            email: row[2],
                            password: row[3],
                            status: row[4],
                        }));
                        callback(users);
                    } else {
                        callback([]);
                    }
                }
            }
        );
    }

    static getUserByEmail(email, callback) {
        User.getAllUser((users) => {
            const userFound = users.find(
                (user) => user.email === email && user.status == 1
            );
            if (userFound) {
                callback({
                    id: userFound.id,
                    name: userFound.name,
                    email: userFound.email,
                });
            } else {
                callback({ error: "No user exists!" });
            }
        });
    }
};
