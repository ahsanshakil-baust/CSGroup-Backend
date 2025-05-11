// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "13M6wC7QupJH-fA_mBY5aNHOsvIW5SOyEZzFVA-A88ws";
// const range = "Sheet1!A:O";

// const auth = new google.auth.GoogleAuth({
//   credentials,
//   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ProjectOverviewModel {
//   constructor(
//     unit,
//     floors,
//     generator,
//     flats,
//     lift,
//     car_parking,
//     community_center,
//     stair,
//     cctv,
//     security_guard,
//     others_facilities,
//     project_id,
//     basement,
//     status = 1,
//     id = 0
//   ) {
//     this.id = id;
//     this.unit = unit;
//     this.floors = floors;
//     this.generator = generator;
//     this.flats = flats;
//     this.lift = lift;
//     this.car_parking = car_parking;
//     this.community_center = community_center;
//     this.stair = stair;
//     this.cctv = cctv;
//     this.security_guard = security_guard;
//     this.others_facilities = others_facilities;
//     this.project_id = project_id;
//     this.basement = basement;
//     this.status = status;
//   }

//   async save(callback) {
//     ProjectOverviewModel.getAllOverview((overviews) => {
//       if (this.id > 0) {
//         overviews = overviews.map((el) => (el.id === this.id ? this : el));
//       } else {
//         this.id = overviews.length + 1;
//         overviews.push(this);
//       }
//       callback({ id: this.id });

//       const updatedData = overviews.map((el) => [
//         el.id,
//         el.unit,
//         el.floors,
//         el.generator,
//         el.flats,
//         el.lift,
//         el.car_parking,
//         el.community_center,
//         el.stair,
//         el.cctv,
//         el.security_guard,
//         JSON.stringify(el.others_facilities),
//         el.project_id,
//         el.basement,
//         el.status,
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

//   static async getAllOverview(callback) {
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
//           const el = rows
//             ? rows.map((row) => ({
//                 id: parseInt(row[0], 10),
//                 unit: row[1],
//                 floors: row[2],
//                 generator: row[3],
//                 flats: row[4],
//                 lift: row[5],
//                 car_parking: row[6],
//                 community_center: row[7],
//                 stair: row[8],
//                 cctv: row[9],
//                 security_guard: row[10],
//                 others_facilities: JSON.parse(row[11] || "[]"),
//                 project_id: row[12],
//                 basement: row[13],
//                 status: parseInt(row[14]),
//               }))
//             : [];
//           callback(el);
//         }
//       }
//     );
//   }

//   static async overviewFindById(id) {
//     return new Promise((resolve, reject) => {
//       ProjectOverviewModel.getAllOverview((overviews) => {
//         if (!overviews) return reject(new Error("No overview data found"));

//         const el =
//           overviews.find((el) => parseInt(el.project_id) == parseInt(id)) ||
//           null;
//         resolve(el);
//       });
//     });
//   }
// };

// const db = require("./firebase");
const db = apps.app3.firestore();
const collectionName = "projectOverviews";

module.exports = class ProjectOverviewModel {
  constructor(
    unit,
    floors,
    generator,
    flats,
    lift,
    car_parking,
    community_center,
    stair,
    cctv,
    security_guard,
    others_facilities = [],
    project_id,
    basement,
    status = 1,
    id = null
  ) {
    this.id = id;
    this.unit = unit;
    this.floors = floors;
    this.generator = generator;
    this.flats = flats;
    this.lift = lift;
    this.car_parking = car_parking;
    this.community_center = community_center;
    this.stair = stair;
    this.cctv = cctv;
    this.security_guard = security_guard;
    this.others_facilities = others_facilities;
    this.project_id = project_id;
    this.basement = basement;
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

      console.log("Project Overview saved to Firebase.");
    } catch (error) {
      console.error("Error saving Project Overview:", error);
    }
  }

  static async getAllOverview(callback) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const data = snapshot.docs.map((doc) => doc.data());
      callback(data);
    } catch (error) {
      console.error("Error fetching project overviews:", error);
      callback([]);
    }
  }

  static async overviewFindById(projectId) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where("project_id", "==", projectId)
        .get();

      if (snapshot.empty) return null;

      // Assuming one overview per project
      return snapshot.docs[0].data();
    } catch (error) {
      console.error("Error finding project overview:", error);
      return null;
    }
  }

  static async deleteByProjectId(project_id) {
    try {
      const snapshot = await db
        .collection(collectionName)
        .where("project_id", "==", project_id)
        .get();

      if (snapshot.empty) {
        console.log(
          `No Project Land Overview entries found for project_id: ${project_id}`
        );
        return;
      }

      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(
        `All Project Land Overview entries for project_id ${project_id} deleted successfully.`
      );
    } catch (error) {
      console.error(
        `Error deleting Project Land Overview entries for project_id ${project_id}:`,
        error
      );
    }
  }
};
