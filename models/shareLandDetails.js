// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "18ADH7-Q-DRZGFa3by74EE_Q6_-b--ezvOPmec-b3Xyo";
// const range = "Sheet1!A:O";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ShareLandDetailsModel {
//     constructor(
//         area,
//         building_height,
//         total_share,
//         total_sqf,
//         net_sqf,
//         price,
//         reg_cost,
//         khariz_cost,
//         other_cost,
//         total_price,
//         share_id,
//         total_floor,
//         total_flat,
//         id = 0,
//         status = 1
//     ) {
//         this.id = id;
//         this.area = area;
//         this.building_height = building_height;
//         this.total_share = total_share;
//         this.total_sqf = total_sqf;
//         this.net_sqf = net_sqf;
//         this.price = price;
//         this.reg_cost = reg_cost;
//         this.khariz_cost = khariz_cost;
//         this.other_cost = other_cost;
//         this.total_price = total_price;
//         this.share_id = share_id;
//         this.total_floor = total_floor;
//         this.total_flat = total_flat;
//         this.status = status;
//     }

//     save(callback) {
//         ShareLandDetailsModel.getAllLandDetails((lands) => {
//             if (this.id > 0) {
//                 lands = lands.map((land) => (land.id == this.id ? this : land));
//             } else {
//                 this.id = lands.length + 1;
//                 lands.push(this);
//             }
//             callback({
//                 id: this.id,
//                 share_id: parseInt(this.share_id),
//             });

//             const updatedData = lands.map((land) => [
//                 land.id,
//                 land.area,
//                 land.building_height,
//                 land.total_share,
//                 land.total_sqf,
//                 land.net_sqf,
//                 land.price,
//                 land.reg_cost,
//                 land.khariz_cost,
//                 land.other_cost,
//                 land.total_price,
//                 land.share_id,
//                 land.total_floor,
//                 land.total_flat,
//                 land.status,
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

//     static getAllLandDetails(callback) {
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
//                     const land = rows
//                         ? rows.map((row) => ({
//                               id: parseInt(row[0], 10),
//                               area: row[1],
//                               building_height: row[2],
//                               total_share: row[3],
//                               total_sqf: row[4],
//                               net_sqf: row[5],
//                               price: row[6],
//                               reg_cost: row[7],
//                               khariz_cost: row[8],
//                               other_cost: row[9],
//                               total_price: row[10],
//                               share_id: row[11],
//                               total_floor: row[12],
//                               total_flat: row[13],
//                               status: parseInt(row[14], 10),
//                           }))
//                         : [];

//                     callback(land);
//                 }
//             }
//         );
//     }

//     static async landFindById(share_id) {
//         return new Promise((resolve, reject) => {
//             ShareLandDetailsModel.getAllLandDetails((lands) => {
//                 if (!lands) return reject(new Error("No land details found"));

//                 const land =
//                     lands.find(
//                         (land) => parseInt(land.share_id) == parseInt(share_id)
//                     ) || null;

//                 resolve(land);
//             });
//         });
//     }
// };

// const db = require("./firebase");
const db = apps.app4.firestore();
const collectionName = "share_land_details";

module.exports = class ShareLandDetailsModel {
  constructor(
    area,
    building_height,
    total_share,
    total_sqf,
    net_sqf,
    price,
    reg_cost,
    khariz_cost,
    other_cost,
    total_price,
    share_id,
    total_floor,
    total_flat,
    id = null,
    status = 1
  ) {
    this.id = id;
    this.area = area;
    this.building_height = building_height;
    this.total_share = total_share;
    this.total_sqf = total_sqf;
    this.net_sqf = net_sqf;
    this.price = price;
    this.reg_cost = reg_cost;
    this.khariz_cost = khariz_cost;
    this.other_cost = other_cost;
    this.total_price = total_price;
    this.share_id = share_id;
    this.total_floor = total_floor;
    this.total_flat = total_flat;
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

      if (callback) {
        callback({
          id: this.id,
          share_id: parseInt(this.share_id),
        });
      }

      console.log("Land detail saved to Firebase.");
    } catch (error) {
      console.error("Error saving land detail to Firebase:", error);
    }
  }

  static async getAllLandDetails(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const lands = snapshot.docs.map((doc) => doc.data());
      callback(lands);
    } catch (error) {
      console.error("Error fetching land details from Firebase:", error);
      callback([]);
    }
  }

  static async landFindById(share_id) {
    return new Promise(async (resolve, reject) => {
      try {
        const snapshot = await db
          .collection(collectionName)
          .where("share_id", "==", share_id.toString())
          .get();

        if (snapshot.empty) {
          return resolve(null);
        }

        const land = snapshot.docs[0].data();
        resolve(land);
      } catch (error) {
        console.error("Error finding land detail by share_id:", error);
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
          `No Share Land Details entries found for share_id: ${share_id}`
        );
        return;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(
        `All Share Land Details entries for share_id ${share_id} deleted successfully.`
      );
    } catch (error) {
      console.error(
        `Error deleting Share Land Details entries for share_id ${share_id}:`,
        error
      );
    }
  }
};
