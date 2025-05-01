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

const db = require("./firebase");

module.exports = class MessageModel {
  constructor(member_id, message, url = "", status = 1, id = 0) {
    this.id = id;
    this.member_id = member_id;
    this.url = url;
    this.message = message;
    this.status = status;
  }

  async save(callback) {
    try {
      const messagesRef = db.collection("messages").doc(String(this.id));

      if (this.id === 0) {
        this.id = Date.now(); // Create a unique ID using timestamp
      }

      await messagesRef.set({
        member_id: this.member_id,
        url: this.url,
        message: this.message,
        status: this.status,
      });

      console.log("Message saved successfully to Firestore!");
      callback(this);
    } catch (err) {
      console.error("Error saving data to Firestore:", err);
    }
  }

  static async getAllMessages(callback) {
    try {
      const snapshot = await db.collection("messages").get();
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        member_id: doc.data().member_id,
        url: doc.data().url,
        message: doc.data().message,
        status: doc.data().status,
      }));
      callback(messages);
    } catch (err) {
      console.error("Error reading from Firestore:", err);
      callback([]);
    }
  }

  static async messageFindById(id, callback) {
    try {
      const doc = await db.collection("messages").doc(id).get();
      if (doc.exists) {
        callback(doc.data());
      } else {
        callback(null);
      }
    } catch (err) {
      console.error("Error fetching data from Firestore:", err);
      callback(null);
    }
  }
};
