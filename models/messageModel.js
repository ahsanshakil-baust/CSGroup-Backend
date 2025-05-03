// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "1Dgu_qjpAIHTDLC8SdpZWu5cCbD60HjTLyUmBg9RAbmg";
// const range = "Sheet1!A:E";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class MessageModel {
//   constructor(member_id, message, url = "", status = 1, id = 0) {
//     this.id = id;
//     this.member_id = member_id;
//     this.url = url;
//     // this.designation = designation;
//     this.message = message;
//     this.status = status;
//   }

//   save() {
//     MessageModel.getAllMessage((data) => {
//       if (this.id > 0) {
//         data = data.map((el) => (el.id == this.id ? this : el));
//       } else {
//         this.id = data.length + 1;
//         data.push(this);
//       }

//       const updatedData = data.map((el) => [
//         el.id,
//         el.member_id,
//         el.url,
//         // el.designation,
//         el.message,
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
//             console.log("Message saved successfully to Google Sheets!");
//           }
//         }
//       );
//     });
//   }

//   static getAllMessage(callback) {
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
//           const notice = rows
//             ? rows.map((row) => ({
//                 id: parseInt(row[0], 10),
//                 member_id: row[1],
//                 url: row[2],
//                 //   designation: row[3],
//                 message: row[3],
//                 status: parseInt(row[4]),
//               }))
//             : [];
//           callback(notice);
//         }
//       }
//     );
//   }

//   static messageFindById(id, callback) {
//     MessageModel.getAllMessage((notices) => {
//       const el = notices.find((el) => el.id === id);
//       callback(el);
//     });
//   }
// };

const db = require("./firebase"); // your firebase.js initialized firestore instance
const collectionName = "messages";

module.exports = class MessageModel {
  constructor(member_id, message, url = "", status = 1, id = null) {
    this.id = id;
    this.member_id = member_id;
    this.url = url;
    this.message = message;
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

      console.log("Message saved to Firebase.");
    } catch (error) {
      console.error("Error saving message to Firebase:", error);
    }
  }

  static async getAllMessage(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const messages = snapshot.docs.map((doc) => doc.data());

      callback(messages);
    } catch (error) {
      console.error("Error retrieving messages from Firebase:", error);
      callback([]);
    }
  }

  static async messageFindById(id, callback) {
    try {
      const doc = await db.collection(collectionName).doc(id).get();
      if (!doc.exists) {
        callback(null);
      } else {
        callback(doc.data());
        console.log(doc.data());
      }
    } catch (error) {
      console.error("Error finding message by ID:", error);
      callback(null);
    }
  }

  static async deleteById(id) {
    try {
      await db.collection(collectionName).doc(id.toString()).delete();
      console.log(`Message with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting message with ID ${id}:`, error);
    }
  }
};
