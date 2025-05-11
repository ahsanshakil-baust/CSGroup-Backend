// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1VgOPUqkFxZNIfC5HYBJIW2l3hOYmKqJgI6vKRibK3Mw";
// const range = "Sheet1!A:M";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ShareFlatModel {
//     constructor(
//         bedrooms,
//         bathrooms,
//         balconies,
//         drawing,
//         dining,
//         kitchen,
//         lift,
//         stair,
//         cctv,
//         generator,
//         share_id,
//         status = 1,
//         id = 0
//     ) {
//         this.id = id;
//         this.bedrooms = bedrooms;
//         this.bathrooms = bathrooms;
//         this.balconies = balconies;
//         this.drawing = drawing;
//         this.dining = dining;
//         this.kitchen = kitchen;
//         this.lift = lift;
//         this.stair = stair;
//         this.cctv = cctv;
//         this.generator = generator;
//         this.share_id = share_id;
//         this.status = status;
//     }

//     async save(callback) {
//         ShareFlatModel.getAllShareFlat((flats) => {
//             if (this.id > 0) {
//                 flats = flats.map((el) => (el.id === this.id ? this : el));
//             } else {
//                 this.id = flats.length + 1;
//                 flats.push(this);
//             }
//             callback({ id: this.id });

//             const updatedData = flats.map((el) => [
//                 el.id,
//                 el.bedrooms,
//                 el.bathrooms,
//                 el.balconies,
//                 el.drawing,
//                 el.dining,
//                 el.kitchen,
//                 el.lift,
//                 el.stair,
//                 el.cctv,
//                 el.generator,
//                 el.share_id,
//                 el.status,
//             ]);

//             sheets.spreadsheets.values.update(
//                 {
//                     spreadsheetId: sheetId,
//                     range: range,
//                     valueInputOption: "RAW",
//                     requestBody: { values: updatedData },
//                 },
//                 (err, res) => {
//                     if (err) {
//                         console.error(
//                             "Error saving data to Google Sheets:",
//                             err
//                         );
//                     } else {
//                         console.log(
//                             "Data saved successfully to Google Sheets!"
//                         );
//                     }
//                 }
//             );
//         });
//     }

//     static async getAllShareFlat(callback) {
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
//                     const el = rows
//                         ? rows.map((row) => ({
//                               id: parseInt(row[0], 10),
//                               bedrooms: row[1],
//                               bathrooms: row[2],
//                               balconies: row[3],
//                               drawing: row[4],
//                               dining: row[5],
//                               kitchen: row[6],
//                               lift: row[7],
//                               stair: row[8],
//                               cctv: row[9],
//                               generator: row[10],
//                               share_id: row[11],
//                               status: parseInt(row[12]),
//                           }))
//                         : [];
//                     callback(el);
//                 }
//             }
//         );
//     }

//     static async shareFlatFindById(id) {
//         return new Promise((resolve, reject) => {
//             ShareFlatModel.getAllShareFlat((flats) => {
//                 if (!flats) return reject(new Error("No overview data found"));

//                 const el =
//                     flats.find(
//                         (el) => parseInt(el.share_id) === parseInt(id)
//                     ) || null;
//                 resolve(el);
//             });
//         });
//     }
// };

// const db = require("./firebase");
const db = apps.app4.firestore();
const collectionName = "share_flats";

module.exports = class ShareFlatModel {
  constructor(
    bedrooms,
    bathrooms,
    balconies,
    drawing,
    dining,
    kitchen,
    lift,
    stair,
    cctv,
    generator,
    share_id,
    status = 1,
    id = null
  ) {
    this.id = id;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.balconies = balconies;
    this.drawing = drawing;
    this.dining = dining;
    this.kitchen = kitchen;
    this.lift = lift;
    this.stair = stair;
    this.cctv = cctv;
    this.generator = generator;
    this.share_id = share_id;
    this.status = status;
  }

  async save(callback) {
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

      if (callback) callback({ id: this.id });

      console.log("Share flat saved to Firebase.");
    } catch (error) {
      console.error("Error saving share flat to Firebase:", error);
    }
  }

  static async getAllShareFlat(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const flats = snapshot.docs.map((doc) => doc.data());
      callback(flats);
    } catch (error) {
      console.error("Error fetching share flats from Firebase:", error);
      callback([]);
    }
  }

  static async shareFlatFindById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const snapshot = await db
          .collection(collectionName)
          .where("share_id", "==", id.toString())
          .get();

        if (snapshot.empty) {
          return resolve(null);
        }

        const result = snapshot.docs[0].data();
        resolve(result);
      } catch (error) {
        console.error("Error finding share flat by share_id:", error);
        reject(error);
      }
    });
  }

  static async deleteByShareId(share_id) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where("share_id", "==", share_id)
        .get();

      if (snapshot.empty) {
        console.log(
          `No Share Flat Details entries found for share_id: ${share_id}`
        );
        return;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(
        `All Share Flat Details entries for share_id ${share_id} deleted successfully.`
      );
    } catch (error) {
      console.error(
        `Error deleting Share Flat Details entries for share_id ${share_id}:`,
        error
      );
    }
  }
};
