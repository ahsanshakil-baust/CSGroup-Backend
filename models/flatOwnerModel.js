// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1_OYKKz5HjqPVDnP0fqxp-7BkqRujwPnfwnTIBs643RQ";
// const range = "Sheet1!A:I";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class OwnerModel {
//     constructor(
//         name,
//         image,
//         occupation,
//         blood_group,
//         p_address,
//         mobile,
//         flat_id,
//         id = 0,
//         status = 1
//     ) {
//         this.id = id;
//         this.name = name;
//         this.image = image;
//         this.occupation = occupation;
//         this.blood_group = blood_group;
//         this.p_address = p_address;
//         this.mobile = mobile;
//         this.flat_id = flat_id;
//         this.status = status;
//     }

//     save() {
//         OwnerModel.getAllOwners((owners) => {
//             if (this.id > 0) {
//                 owners = owners.map((owner) =>
//                     owner.id == this.id ? this : owner
//                 );
//             } else {
//                 this.id = owners.length + 1;
//                 owners.push(this);
//             }

//             const updatedData = owners.map((owner) => [
//                 owner.id,
//                 owner.name,
//                 owner.image,
//                 owner.occupation,
//                 owner.blood_group,
//                 owner.p_address,
//                 owner.mobile,
//                 owner.flat_id,
//                 owner.status,
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

//     static getAllOwners(callback) {
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
//                     const owner = rows
//                         ? rows.map((row) => ({
//                               id: parseInt(row[0], 10),
//                               name: row[1],
//                               image: row[2],
//                               occupation: row[3],
//                               blood_group: row[4],
//                               p_address: row[5],
//                               mobile: row[6],
//                               flat_id: row[7],
//                               status: parseInt(row[8], 10),
//                           }))
//                         : [];

//                     callback(owner);
//                 }
//             }
//         );
//     }

//     // static async ownerFindById(id, calback) {
//     //     OwnerModel.getAllOwners((owners) => {
//     //         const owner =
//     //             owners.find(
//     //                 (owner) => parseInt(owner.flat_id) == parseInt(id)
//     //             ) || null;
//     //         calback(owner);
//     //     });
//     // }

//     static async ownerFindById(id) {
//         return new Promise((resolve, reject) => {
//             OwnerModel.getAllOwners((owners) => {
//                 if (!owners) return reject(new Error("No owners found"));

//                 const owner =
//                     owners.find(
//                         (owner) => parseInt(owner.flat_id) === parseInt(id)
//                     ) || null;
//                 resolve(owner);
//             });
//         });
//     }
// };

// OwnerModel.js
// const db = require("./firebase");
const db = apps.app3.firestore();

const collectionName = "owners";

module.exports = class OwnerModel {
  constructor(
    name = "",
    image = "",
    occupation = "",
    blood_group = "",
    p_address = "",
    mobile = "",
    flat_id,
    id = null,
    status = 1
  ) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.occupation = occupation;
    this.blood_group = blood_group;
    this.p_address = p_address;
    this.mobile = mobile;
    this.flat_id = flat_id;
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

      if (callback) callback(this.id);

      console.log("Owner saved successfully to Firebase.");
    } catch (error) {
      console.error("Error saving owner:", error);
    }
  }

  static async getAllOwners(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const data = snapshot.docs.map((doc) => doc.data());
      callback(data);
    } catch (error) {
      console.error("Error fetching owners:", error);
      callback([]);
    }
  }

  static async ownerFindById(flat_id) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where("flat_id", "==", flat_id)
        .limit(1)
        .get();

      if (snapshot.empty) return null;

      return snapshot.docs[0].data();
    } catch (error) {
      console.error("Error finding owner by flat_id:", error);
      return null;
    }
  }

  static async deleteById(id) {
    try {
      await db.collection(collectionName).doc(id.toString()).delete();
      console.log(`Owner with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting owner with ID ${id}:`, error);
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
          `No Flat Owner Details entries found for flat_id: ${flat_id}`
        );
        return;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(
        `All Flat Owner Details entries for flat_id ${flat_id} deleted successfully.`
      );
    } catch (error) {
      console.error(
        `Error deleting Flat Owner Details entries for flat_id ${flat_id}:`,
        error
      );
    }
  }
};
