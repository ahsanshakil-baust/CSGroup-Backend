// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "1y7GrWn2Eb5JFzkz_uZ4Xv0zN5_2k2ZK0-2-r4BaJpo4";
// const range = "Sheet1!A:G";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ExperienceModel {
//     constructor(
//         title,
//         profession,
//         about,
//         date_duration,
//         portfolio_id,
//         status = 1,
//         id = 0
//     ) {
//         this.id = id;
//         this.title = title;
//         this.profession = profession;
//         this.about = about;
//         this.date_duration = date_duration;
//         this.portfolio_id = portfolio_id;
//         this.status = status;
//     }

//     save() {
//         ExperienceModel.getAllExperience((data) => {
//             if (this.id > 0) {
//                 data = data.map((el) => (el.id == this.id ? this : el));
//             } else {
//                 this.id = data.length + 1;
//                 data.push(this);
//             }

//             const updatedData = data.map((el) => [
//                 el.id,
//                 el.title,
//                 el.profession,
//                 el.about,
//                 el.date_duration,
//                 el.portfolio_id,
//                 el.status,
//             ]);

//             sheets.spreadsheets.values.update(
//                 {
//                     spreadsheetId: sheetId,
//                     range: range,
//                     valueInputOption: "RAW",
//                     requestBody: {
//                         values: updatedData,
//                     },
//                 },
//                 (err, res) => {
//                     if (err) {
//                         console.error(
//                             "Error saving data to Google Sheets:",
//                             err
//                         );
//                     } else {
//                         console.log(
//                             "Certificate saved successfully to Google Sheets!"
//                         );
//                     }
//                 }
//             );
//         });
//     }

//     static getAllExperience(callback) {
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
//                     const event = rows
//                         ? rows.map((row) => ({
//                               id: parseInt(row[0], 10),
//                               title: row[1],
//                               profession: row[2],
//                               about: row[3],
//                               date_duration: row[4],
//                               portfolio_id: row[5],
//                               status: parseInt(row[6]),
//                           }))
//                         : [];
//                     callback(event);
//                 }
//             }
//         );
//     }

//     // static experienceFindById(id, callback) {
//     //     ExperienceModel.getAllExperience((events) => {
//     //         const el = events.find((el) => el.portfolio_id == id);
//     //         callback(el);
//     //     });
//     // }

//     static experienceFindById(id, callback) {
//         return new Promise((resolve, reject) => {
//             ExperienceModel.getAllExperience((experience) => {
//                 if (!experience)
//                     return reject(new Error("No Experience found"));
//                 const el =
//                     experience.filter((el) => el.portfolio_id == id) || null;
//                 resolve(el);
//             });
//         });
//     }

//     static experienceById(id, callback) {
//         return new Promise((resolve, reject) => {
//             ExperienceModel.getAllExperience((experience) => {
//                 if (!experience)
//                     return reject(new Error("No Experience found"));
//                 const el = experience.find((el) => el.id == id) || null;
//                 resolve(el);
//             });
//         });
//     }
// };

// ExperienceModel.js
const db = require("./firebase");

module.exports = class ExperienceModel {
  constructor(
    title,
    profession,
    about,
    date_duration,
    portfolio_id,
    status = 1,
    id = 0
  ) {
    this.id = id;
    this.title = title;
    this.profession = profession;
    this.about = about;
    this.date_duration = date_duration;
    this.portfolio_id = portfolio_id;
    this.status = status;
  }

  async save() {
    const experienceRef = db.collection("experience").doc(String(this.id));

    try {
      await experienceRef.set({
        title: this.title,
        profession: this.profession,
        about: this.about,
        date_duration: this.date_duration,
        portfolio_id: this.portfolio_id,
        status: this.status,
      });
      console.log("Experience saved successfully to Firestore!");
    } catch (err) {
      console.error("Error saving experience to Firestore:", err);
    }
  }

  static async getAllExperience(callback) {
    const experienceRef = db.collection("experience");

    try {
      const snapshot = await experienceRef.get();
      const experienceData = snapshot.docs.map((doc) => doc.data());
      callback(experienceData);
    } catch (err) {
      console.error("Error reading experiences from Firestore:", err);
      callback([]);
    }
  }

  static async experienceFindById(id, callback) {
    try {
      const experienceData = await ExperienceModel.getAllExperience(
        (data) => data
      );
      const experience = experienceData.find((el) => el.portfolio_id === id);
      callback(experience);
    } catch (err) {
      console.error("Error finding experience by ID:", err);
      callback(null);
    }
  }

  static async experienceById(id, callback) {
    try {
      const experienceData = await ExperienceModel.getAllExperience(
        (data) => data
      );
      const experience = experienceData.find((el) => el.id === id);
      callback(experience);
    } catch (err) {
      console.error("Error finding experience by ID:", err);
      callback(null);
    }
  }
};
