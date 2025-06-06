// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1AhGtAtMksZC5nf7JDEx-RrzOPcrauPAUz14QN0IHemY";
// const range = "Sheet1!A:W";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class FlatModel {
//   constructor(
//     type,
//     flat_number,
//     floor,
//     address,
//     direction,
//     bedrooms,
//     drawing,
//     dining,
//     bathrooms,
//     balconies,
//     kitchen,
//     flat_images,
//     feature_images,
//     flat_videos,
//     completion_status,
//     project_id,
//     available,
//     city,
//     room_type,
//     description,
//     serial_no,
//     status = 1,
//     id = 0
//   ) {
//     this.id = id;
//     this.type = type;
//     this.flat_number = flat_number;
//     this.floor = floor;
//     this.address = address;
//     this.direction = direction;
//     this.bedrooms = bedrooms;
//     this.drawing = drawing;
//     this.dining = dining;
//     this.bathrooms = bathrooms;
//     this.balconies = balconies;
//     this.kitchen = kitchen;
//     this.flat_images = flat_images;
//     this.feature_images = feature_images;
//     this.flat_videos = flat_videos;
//     this.completion_status = completion_status;
//     this.project_id = project_id;
//     this.available = available;
//     this.city = city;
//     this.room_type = room_type;
//     this.description = description;
//     this.serial_no = serial_no;
//     this.status = status;
//   }

//   async save(callback) {
//     FlatModel.getAllFlat((flats) => {
//       if (this.id > 0) {
//         flats = flats.map((flat) => (flat.id === this.id ? this : flat));
//       } else {
//         this.id = flats.length + 1;
//         flats.push(this);
//       }

//       callback({ id: this.id });

//       const updatedData = flats.map((flat) => [
//         flat.id,
//         flat.type,
//         flat.flat_number,
//         flat.floor,
//         flat.address,
//         flat.direction,
//         flat.bedrooms,
//         flat.drawing,
//         flat.dining,
//         flat.bathrooms,
//         flat.balconies,
//         flat.kitchen,
//         JSON.stringify(flat.flat_images),
//         JSON.stringify(flat.feature_images),
//         JSON.stringify(flat.flat_videos),
//         flat.completion_status,
//         flat.project_id,
//         flat.available,
//         flat.city,
//         flat.room_type,
//         flat.description,
//         flat.serial_no,
//         flat.status,
//       ]);

//       sheets.spreadsheets.values.update(
//         {
//           spreadsheetId: sheetId,
//           range: range,
//           valueInputOption: "RAW",
//           requestBody: { values: updatedData },
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

//   static async getAllFlat(callback) {
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
//           const flat = rows
//             ? rows.map((row) => ({
//                 id: parseInt(row[0], 10),
//                 type: row[1],
//                 flat_number: row[2],
//                 floor: row[3],
//                 address: row[4],
//                 direction: row[5],
//                 bedrooms: row[6],
//                 drawing: row[7],
//                 dining: row[8],
//                 bathrooms: row[9],
//                 balconies: row[10],
//                 kitchen: row[11],
//                 flat_images: JSON.parse(row[12] || "[]"),
//                 feature_images: JSON.parse(row[13] || "[]"),
//                 flat_videos: JSON.parse(row[14] || "[]"),
//                 completion_status: row[15],
//                 project_id: row[16],
//                 available: row[17],
//                 city: row[18],
//                 room_type: row[19],
//                 description: row[20],
//                 serial_no: row[21],
//                 status: parseInt(row[22]),
//               }))
//             : [];
//           callback(flat);
//         }
//       }
//     );
//   }

//   static async flatFindById(id) {
//     return new Promise((resolve, reject) => {
//       FlatModel.getAllFlat((flats) => {
//         if (!flats) return reject(new Error("No flats found"));

//         const flat = flats.find((flat) => flat.id === id) || null;
//         resolve(flat);
//       });
//     });
//   }

//   static async flatIdByProjectFloor(id, floor) {
//     return new Promise((resolve, reject) => {
//       FlatModel.getAllFlat((flats) => {
//         if (!flats) return reject(new Error("No flats found"));

//         // Filter and sort in a single pass
//         const newData = flats
//           .filter((flat) => flat.project_id == id && flat.floor == floor) // Filter flats by project_id and floor
//           //   .map(({ id, serial_no, room_type }) => ({
//           //     id,
//           //     serial_no,
//           //     room_type,
//           //   })) // Map to only the necessary properties
//           .sort((a, b) => a.serial_no - b.serial_no); // Sort by serial_no numerically

//         console.log(newData);

//         resolve(newData);
//       });
//     });
//   }
// };

// FlatModel.js
// const db = require("./firebase");
const db = apps.app3.firestore(); // Ensure `apps.app2` is properly initialized

const collectionName = "flats";

module.exports = class FlatModel {
  constructor(
    type,
    flat_number,
    floor,
    address,
    direction,
    bedrooms,
    drawing,
    dining,
    bathrooms,
    balconies,
    kitchen,
    flat_images = [],
    feature_images = [],
    flat_videos = [],
    completion_status,
    project_id,
    available,
    city,
    room_type,
    description,
    serial_no,
    status = 1,
    id = null
  ) {
    this.id = id;
    this.type = type;
    this.flat_number = flat_number;
    this.floor = floor;
    this.address = address;
    this.direction = direction;
    this.bedrooms = bedrooms;
    this.drawing = drawing;
    this.dining = dining;
    this.bathrooms = bathrooms;
    this.balconies = balconies;
    this.kitchen = kitchen;
    this.flat_images = flat_images;
    this.feature_images = feature_images;
    this.flat_videos = flat_videos;
    this.completion_status = completion_status;
    this.project_id = project_id;
    this.available = available;
    this.city = city;
    this.room_type = room_type;
    this.description = description;
    this.serial_no = serial_no;
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
      console.log("Flat saved successfully to Firebase.");
    } catch (error) {
      console.error("Error saving flat:", error);
    }
  }

  static async getAllFlat(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const data = snapshot.docs.map((doc) => doc.data());
      callback(data);
    } catch (error) {
      console.error("Error fetching flats:", error);
      callback([]);
    }
  }

  static async flatFindById(id) {
    try {
      const doc = await db.collection(collectionName).doc(id.toString()).get();
      if (!doc.exists) throw new Error("No Flat found");
      return doc.data();
    } catch (error) {
      console.error("Error finding flat:", error);
      return null;
    }
  }

  static async flatIdByProjectFloor(project_id, floor) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where("project_id", "==", project_id)
        .where("floor", "==", floor)
        .get();

      const data = snapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a.serial_no - b.serial_no);

      return data;
    } catch (error) {
      console.error("Error filtering flats by project and floor:", error);
      return [];
    }
  }

  static async flatByProject(project_id) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where("project_id", "==", project_id)
        .get();

      const data = snapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => a.serial_no - b.serial_no);

      return data;
    } catch (error) {
      console.error("Error filtering flats by project and floor:", error);
      return [];
    }
  }

  static async deleteById(id) {
    try {
      await db.collection(collectionName).doc(id.toString()).delete();
      console.log(`Flat with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting flat with ID ${id}:`, error);
    }
  }
};
