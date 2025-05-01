// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "17T0bbFr1EKNFk0YB6ZtCndPsClp98i-V8IRu1nLkF2I";
// const range = "Sheet1!A:K";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ShareModel {
//   constructor(
//     name,
//     // project_type,
//     location,
//     description,
//     share_videos,
//     project_images,
//     map_url,
//     project_structure,
//     city,
//     available,
//     id = 0,
//     status = 1
//   ) {
//     this.id = id;
//     this.name = name;
//     // this.project_type = project_type;
//     this.location = location;
//     this.description = description;
//     this.share_videos = share_videos;
//     this.project_images = project_images;
//     this.map_url = map_url;
//     this.project_structure = project_structure;
//     this.city = city;
//     this.available = available;
//     this.status = status;
//   }

//   save(callback) {
//     ShareModel.getAllShares((projects) => {
//       if (this.id > 0) {
//         projects = projects.map((project) =>
//           project.id == this.id ? this : project
//         );
//       } else {
//         this.id = projects.length + 1;
//         projects.push(this);
//       }

//       // Ensure callback is always called
//       if (callback) callback(this.id);

//       const updatedData = projects.map((project) => [
//         project.id,
//         project.name,
//         // project.project_type,
//         project.location,
//         project.description,
//         JSON.stringify(project.share_videos),
//         JSON.stringify(project.project_images),
//         project.map_url,
//         project.project_structure,
//         project.city,
//         project.available,
//         project.status,
//       ]);

//       if (!sheets || !sheetId || !range) {
//         console.error("Missing required variables for Google Sheets API.");
//         return;
//       }

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

//   static getAllShares(callback) {
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
//           const project = rows
//             ? rows.map((row) => ({
//                 id: parseInt(row[0], 10),
//                 name: row[1],
//                 //   project_type: row[2],
//                 location: row[2],
//                 description: row[3],
//                 share_videos: JSON.parse(row[4] || "[]"),
//                 project_images: JSON.parse(row[5] || "[]"),
//                 map_url: row[6],
//                 project_structure: row[7],
//                 city: row[8],
//                 available: row[9],
//                 status: parseInt(row[10]),
//               }))
//             : [];

//           callback(project);
//         }
//       }
//     );
//   }

//   static async shareFindById(id) {
//     return new Promise((resolve, reject) => {
//       ShareModel.getAllShares((projects) => {
//         if (!projects) return reject(new Error("No projects found"));

//         const project = projects.find((project) => project.id == id) || null;
//         resolve(project);
//       });
//     });
//   }
// };

const db = require("./firebase");
const collectionName = "shares";

module.exports = class ShareModel {
  constructor(
    name,
    location,
    description,
    share_videos,
    project_images,
    map_url,
    project_structure,
    city,
    available,
    id = null,
    status = 1
  ) {
    this.id = id;
    this.name = name;
    this.location = location;
    this.description = description;
    this.share_videos = share_videos;
    this.project_images = project_images;
    this.map_url = map_url;
    this.project_structure = project_structure;
    this.city = city;
    this.available = available;
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
      console.log("Share saved to Firebase.");
    } catch (error) {
      console.error("Error saving share to Firebase:", error);
    }
  }

  static async getAllShares(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const shares = snapshot.docs.map((doc) => doc.data());
      callback(shares);
    } catch (error) {
      console.error("Error getting shares from Firebase:", error);
      callback([]);
    }
  }

  static async shareFindById(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await db
          .collection(collectionName)
          .doc(id.toString())
          .get();
        if (!doc.exists) {
          resolve(null);
        } else {
          resolve(doc.data());
        }
      } catch (error) {
        console.error("Error finding share by ID:", error);
        reject(error);
      }
    });
  }
};
