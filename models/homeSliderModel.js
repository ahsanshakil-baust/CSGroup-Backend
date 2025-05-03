// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "1BwR9akqSatx0-gentq8HOe6QXU5Q5niX7bAxvYFRfi0";
// const range = "Sheet1!A1:C";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class HomeSliders {
//   constructor(url, status = 1, id = 0) {
//     this.id = id;
//     this.url = url;
//     this.status = status;
//   }

//   save() {
//     HomeSliders.getAllSlider((data) => {
//       if (this.id > 0) {
//         data = data.map((slider) => {
//           if (slider.id === this.id) {
//             return this;
//           }
//           return slider;
//         });
//       } else {
//         this.id = data.length + 1;
//         data.push(this);
//       }

//       const updatedData = data.map((slider) => [
//         slider.id,
//         slider.url,
//         slider.status,
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
//             console.log("Data saved successfully to Google Sheets!");
//           }
//         }
//       );
//     });
//   }

//   static getAllSlider(callback) {
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
//           const sliders = rows
//             ? rows.map((row) => ({
//                 id: parseInt(row[0], 10),
//                 url: row[1],
//                 status: parseInt(row[2]),
//               }))
//             : [];
//           callback(sliders);
//         }
//       }
//     );
//   }

//   static sliderFindById(id, callback) {
//     HomeSliders.getAllSlider((sliders) => {
//       const slider = sliders.find((slider) => slider.id === id);
//       callback(slider);
//     });
//   }
// };

const db = require("./firebase");
const collectionName = "home_sliders";

module.exports = class HomeSliders {
  constructor(url, status = 1, id = null) {
    this.id = id;
    this.url = url;
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

      console.log("Slider saved to Firebase.");
    } catch (error) {
      console.error("Error saving slider to Firebase:", error);
    }
  }

  static async getAllSlider(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const sliders = snapshot.docs.map((doc) => doc.data());
      callback(sliders);
    } catch (error) {
      console.error("Error retrieving sliders from Firebase:", error);
      callback([]);
    }
  }

  static async sliderFindById(id, callback) {
    try {
      const doc = await db.collection(collectionName).doc(id.toString()).get();
      if (!doc.exists) {
        callback(null);
      } else {
        callback(doc.data());
      }
    } catch (error) {
      console.error("Error finding slider by ID:", error);
      callback(null);
    }
  }

  static async deleteById(id) {
    try {
      await db.collection(collectionName).doc(id.toString()).delete();
      console.log(`Slider with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting slider with ID ${id}:`, error);
    }
  }
};
