// const { google } = require("googleapis");
// const credentials = require("./credentials.json");

// const sheetId = "1fzbppdeHL76Mumgy1uR_8tK48TMNI3pqHKsZKdIJ0hA";
// const range = "Sheet1!A:E"; // Assuming columns: ID, Name, Email, Password

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class User {
//   constructor(member_id, email, password, status = 0) {
//     this.id = 0;
//     this.member_id = member_id;
//     this.email = email;
//     this.password = password;
//     this.status = status;
//   }

//   save() {
//     User.getAllUser((users) => {
//       if (this.id > 0) {
//         users = users.map((user) => (user.id === this.id ? this : user));
//       } else {
//         this.id = users.length + 1;
//         users.push(this);
//       }

//       const updatedData = users.map((u) => [
//         u.id,
//         u.member_id,
//         u.email,
//         u.password,
//         u.status,
//       ]);

//       sheets.spreadsheets.values.update(
//         {
//           spreadsheetId: sheetId,
//           range: range,
//           valueInputOption: "RAW",
//           requestBody: { values: updatedData },
//         },
//         (err, res) => {
//           if (err) console.error("Error saving user to Google Sheets:", err);
//           else console.log("User saved successfully to Google Sheets!");
//         }
//       );
//     });
//   }

//   static getAllUser(callback) {
//     sheets.spreadsheets.values.get(
//       {
//         spreadsheetId: sheetId,
//         range: range,
//       },
//       (err, res) => {
//         if (err) {
//           console.error("Error reading users from Google Sheets:", err);
//           callback([]);
//         } else {
//           const rows = res.data.values;
//           if (rows && rows.length) {
//             const users = rows.map((row) => ({
//               id: parseInt(row[0]),
//               member_id: row[1],
//               email: row[2],
//               password: row[3],
//               status: row[4],
//             }));
//             callback(users);
//           } else {
//             callback([]);
//           }
//         }
//       }
//     );
//   }

//   static getUserByEmail(email, callback) {
//     User.getAllUser((users) => {
//       const userFound = users.find(
//         (user) => user.email === email && user.status == 1
//       );
//       if (userFound) {
//         callback({
//           id: userFound.id,
//           member_id: userFound.member_id,
//           email: userFound.email,
//         });
//       } else {
//         callback({ error: "No user exists!" });
//       }
//     });
//   }
// };

// User.js
const db = require("./firebase");

module.exports = class User {
  constructor(member_id, email, password, status = 0) {
    this.id = 0;
    this.member_id = member_id;
    this.email = email;
    this.password = password;
    this.status = status;
  }

  async save() {
    const usersRef = db.collection("users");

    if (this.id > 0) {
      // Update existing user by ID
      const userDoc = await usersRef.doc(this.id.toString()).get();
      if (userDoc.exists) {
        await usersRef.doc(this.id.toString()).set({
          id: this.id,
          member_id: this.member_id,
          email: this.email,
          password: this.password,
          status: this.status,
        });
        console.log("User updated successfully in Firestore!");
      } else {
        console.error("User with this ID does not exist.");
      }
    } else {
      // Add new user
      const snapshot = await usersRef.get();
      this.id = snapshot.size + 1;
      await usersRef.doc(this.id.toString()).set({
        id: this.id,
        member_id: this.member_id,
        email: this.email,
        password: this.password,
        status: this.status,
      });
      console.log("User added successfully to Firestore!");
    }
  }

  static async getAllUser(callback) {
    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef.get();
      const users = [];
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });
      callback(users);
    } catch (err) {
      console.error("Error fetching users from Firestore:", err);
      callback([]);
    }
  }

  static async getUserByEmail(email, callback) {
    try {
      const usersRef = db.collection("users");
      const snapshot = await usersRef
        .where("email", "==", email)
        .where("status", "==", 1)
        .get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        const user = userDoc.data();
        callback({
          id: user.id,
          member_id: user.member_id,
          email: user.email,
        });
      } else {
        callback({ error: "No user exists!" });
      }
    } catch (err) {
      console.error("Error finding user by email:", err);
      callback({ error: "Error occurred while retrieving user." });
    }
  }
};
