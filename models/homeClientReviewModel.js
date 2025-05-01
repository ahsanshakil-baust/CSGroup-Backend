// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "1yEWz8zgGLy7VpfvvJAGkdDCzxsKcpNii0t_wkcFnAQU";
// const range = "Sheet1!A:G"; // Adjust sheet name if needed

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class HomeClientReview {
//   constructor(name, url, comment, star, video, status = 1, id = 0) {
//     this.id = id;
//     this.name = name;
//     this.url = url;
//     this.comment = comment;
//     this.star = star;
//     this.video = video;
//     this.status = status;
//   }

//   save() {
//     HomeClientReview.getAllReview((data) => {
//       if (this.id > 0) {
//         data = data.map((review) => (review.id === this.id ? this : review));
//       } else {
//         this.id = data.length + 1;
//         data.push(this);
//       }

//       const updatedData = data.map((review) => [
//         review.id,
//         review.name,
//         review.url,
//         review.comment,
//         review.star,
//         review.video,
//         review.status,
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
//             console.log("Client review saved successfully to Google Sheets!");
//           }
//         }
//       );
//     });
//   }

//   static getAllReview(callback) {
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
//           const reviews = rows
//             ? rows.map((row) => ({
//                 id: parseInt(row[0], 10),
//                 name: row[1],
//                 url: row[2],
//                 comment: row[3],
//                 star: row[4],
//                 video: row[5],
//                 status: parseInt(row[6]),
//               }))
//             : [];
//           callback(reviews);
//         }
//       }
//     );
//   }

//   static reviewFindById(id, callback) {
//     HomeClientReview.getAllReview((reviews) => {
//       const review = reviews.find((el) => el.id === id);
//       callback(review);
//     });
//   }

//   static deleteById(id, callback) {
//     HomeClientReview.getAllReview((data) => {
//       const updatedData = data.filter((review) => review.id !== id);

//       if (updatedData.length > 0) {
//         const updatedValues = updatedData.map((review, index) => [
//           index + 1,
//           review.name,
//           review.url,
//           review.comment,
//           review.star,
//           review.video,
//         ]);

//         sheets.spreadsheets.values.update(
//           {
//             spreadsheetId: sheetId,
//             range: range,
//             valueInputOption: "RAW",
//             requestBody: {
//               values: updatedValues,
//             },
//           },
//           (err, res) => {
//             if (err) {
//               console.error("Error deleting data from Google Sheets:", err);
//               callback(err);
//             } else {
//               console.log(
//                 "Client review deleted successfully from Google Sheets!"
//               );
//               callback(null);
//             }
//           }
//         );
//       } else {
//         sheets.spreadsheets.values.clear(
//           {
//             spreadsheetId: sheetId,
//             range: range,
//           },
//           (err, res) => {
//             if (err) {
//               console.error("Error clearing Google Sheets:", err);
//               callback(err);
//             } else {
//               console.log("All client reviews cleared from Google Sheets!");
//               callback(null);
//             }
//           }
//         );
//       }
//     });
//   }
// };

const db = require("./firebase");

module.exports = class HomeClientReview {
  constructor(name, url, comment, star, video, status = 1, id = 0) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.comment = comment;
    this.star = star;
    this.video = video;
    this.status = status;
  }

  async save(callback) {
    const reviewRef = db.collection("client_reviews").doc(String(this.id));

    try {
      await reviewRef.set({
        name: this.name,
        url: this.url,
        comment: this.comment,
        star: this.star,
        video: this.video,
        status: this.status,
      });
      console.log("Client review saved successfully to Firestore!");
      callback({ id: this.id });
    } catch (err) {
      console.error("Error saving review to Firestore:", err);
    }
  }

  static async getAllReview(callback) {
    const reviewRef = db.collection("client_reviews");

    try {
      const snapshot = await reviewRef.get();
      const reviews = snapshot.docs.map((doc) => doc.data());
      callback(reviews);
    } catch (err) {
      console.error("Error reading reviews from Firestore:", err);
      callback([]);
    }
  }

  static async reviewFindById(id, callback) {
    const reviewRef = db.collection("client_reviews").doc(String(id));

    try {
      const doc = await reviewRef.get();
      if (doc.exists) {
        callback(doc.data());
      } else {
        callback(null);
      }
    } catch (err) {
      console.error("Error finding review by ID:", err);
      callback(null);
    }
  }

  static async deleteById(id, callback) {
    const reviewRef = db.collection("client_reviews").doc(String(id));

    try {
      await reviewRef.delete();
      console.log("Client review deleted successfully from Firestore!");
      callback(null);
    } catch (err) {
      console.error("Error deleting review from Firestore:", err);
      callback(err);
    }
  }
};
