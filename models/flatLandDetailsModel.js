// const { google } = require("googleapis");

// const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1T8GJoUcX0Mf3jRn3qeJ2qYzUz-Hi2p2lPPpyNksiBeY";
// const range = "Sheet1!A:N";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class FlatLandDetailsModel {
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
//         flat_id,
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
//         this.flat_id = flat_id;
//         this.status = status;
//     }

//     save(callback) {
//         FlatLandDetailsModel.getAllLandDetails((lands) => {
//             if (this.id > 0) {
//                 lands = lands.map((land) => (land.id == this.id ? this : land));
//             } else {
//                 this.id = lands.length + 1;
//                 lands.push(this);
//             }
//             callback({
//                 id: this.id,
//                 flat_id: parseInt(this.flat_id),
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
//                 land.flat_id,
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
//                               flat_id: row[11],
//                               status: parseInt(row[12], 10),
//                           }))
//                         : [];

//                     callback(land);
//                 }
//             }
//         );
//     }

//     static async landFindById(flat_id) {
//         return new Promise((resolve, reject) => {
//             FlatLandDetailsModel.getAllLandDetails((lands) => {
//                 if (!lands) return reject(new Error("No land details found"));

//                 const land =
//                     lands.find(
//                         (land) => parseInt(land.flat_id) === parseInt(flat_id)
//                     ) || null;

//                 resolve(land);
//             });
//         });
//     }
// };

// FlatLandDetailsModel.js
// const db = require("./firebase");
const apps = require("./firebase");
const db = apps.app3.firestore();
const collectionName = "flat_land_details";

module.exports = class FlatLandDetailsModel {
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
    flat_id,
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
    this.flat_id = flat_id;
    this.status = status;
  }

  async save(callback) {
    try {
      const data = {
        area: this.area,
        building_height: this.building_height,
        total_share: this.total_share,
        total_sqf: this.total_sqf,
        net_sqf: this.net_sqf,
        price: this.price,
        reg_cost: this.reg_cost,
        khariz_cost: this.khariz_cost,
        other_cost: this.other_cost,
        total_price: this.total_price,
        flat_id: this.flat_id,
        status: this.status,
      };

      let docRef;

      if (this.id) {
        docRef = db.collection(collectionName).doc(this.id.toString());
        await docRef.set({ ...data, id: this.id });
      } else {
        docRef = await db.collection(collectionName).add(data);
        this.id = docRef.id;
        await docRef.update({ id: this.id });
      }

      if (callback) callback(this.id);
      console.log("Flat land detail saved successfully to Firebase.");
    } catch (error) {
      console.error("Error saving flat land detail:", error);
    }
  }

  static async getAllLandDetails(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const data = snapshot.docs.map((doc) => doc.data());
      callback(data);
    } catch (error) {
      console.error("Error fetching land details:", error);
      callback([]);
    }
  }

  static async landFindById(flat_id) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where("flat_id", "==", flat_id)
        .get();

      if (snapshot.empty) return null;

      return snapshot.docs[0].data();
    } catch (error) {
      console.error("Error finding land detail:", error);
      return null;
    }
  }

  static async deleteById(id) {
    try {
      await db.collection(collectionName).doc(id.toString()).delete();
      console.log(`Flat land detail with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting flat land detail with ID ${id}:`, error);
    }
  }

  static async deleteByFlatId(flat_id) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where("flat_id", "==", flat_id)
        .get();

      if (snapshot.empty) {
        console.log(
          `No Flat Land Details entries found for flat_id: ${flat_id}`
        );
        return;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(
        `All Flat Land Details entries for flat_id ${flat_id} deleted successfully.`
      );
    } catch (error) {
      console.error(
        `Error deleting Flat Land Details entries for flat_id ${flat_id}:`,
        error
      );
    }
  }
};
