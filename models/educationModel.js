// const { google } = require("googleapis");

// const credentials = require("./credentials.json");
// const sheetId = "1V3E3tP1x_c_88gNE972V_BXC8rpA63FbGAY_83rHhto";
// const range = "Sheet1!A:H";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class EducationModel {
//     constructor(
//         title,
//         profession,
//         institution,
//         about,
//         date_duration,
//         portfolio_id,
//         status = 1,
//         id = 0
//     ) {
//         this.id = id;
//         this.title = title;
//         this.profession = profession;
//         this.institution = institution;
//         this.about = about;
//         this.date_duration = date_duration;
//         this.portfolio_id = portfolio_id;
//         this.status = status;
//     }

//     save() {
//         EducationModel.getAllEducation((data) => {
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
//                 el.institution,
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

//     static getAllEducation(callback) {
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
//                               institution: row[3],
//                               about: row[4],
//                               date_duration: row[5],
//                               portfolio_id: row[6],
//                               status: parseInt(row[7]),
//                           }))
//                         : [];
//                     callback(event);
//                 }
//             }
//         );
//     }

//     // static educationFindById(id, callback) {
//     //     EducationModel.getAllEducation((events) => {
//     //         const el = events.find((el) => el.portfolio_id == id);
//     //         callback(el);
//     //     });
//     // }

//     static educationFindById(id, callback) {
//         return new Promise((resolve, reject) => {
//             EducationModel.getAllEducation((education) => {
//                 if (!education) return reject(new Error("No Education found"));
//                 const el =
//                     education.filter((el) => el.portfolio_id == id) || null;
//                 resolve(el);
//             });
//         });
//     }

//     static educationById(id, callback) {
//         return new Promise((resolve, reject) => {
//             EducationModel.getAllEducation((education) => {
//                 if (!education) return reject(new Error("No Education found"));
//                 const el = education.find((el) => el.id == id) || null;
//                 resolve(el);
//             });
//         });
//     }
// };

// EducationModel.js
const db = require("./firebase");

module.exports = class EducationModel {
  constructor(
    title,
    profession,
    institution,
    about,
    date_duration,
    portfolio_id,
    status = 1,
    id = 0
  ) {
    this.id = id;
    this.title = title;
    this.profession = profession;
    this.institution = institution;
    this.about = about;
    this.date_duration = date_duration;
    this.portfolio_id = portfolio_id;
    this.status = status;
  }

  async save() {
    const educationRef = db.collection("education").doc(String(this.id));

    try {
      await educationRef.set({
        title: this.title,
        profession: this.profession,
        institution: this.institution,
        about: this.about,
        date_duration: this.date_duration,
        portfolio_id: this.portfolio_id,
        status: this.status,
      });
      console.log("Education saved successfully to Firestore!");
    } catch (err) {
      console.error("Error saving education to Firestore:", err);
    }
  }

  static async getAllEducation(callback) {
    const educationRef = db.collection("education");

    try {
      const snapshot = await educationRef.get();
      const educationData = snapshot.docs.map((doc) => doc.data());
      callback(educationData);
    } catch (err) {
      console.error("Error reading education from Firestore:", err);
      callback([]);
    }
  }

  static async educationFindById(id, callback) {
    try {
      const educationData = await EducationModel.getAllEducation(
        (data) => data
      );
      const filteredData = educationData.filter((el) => el.portfolio_id == id);
      callback(filteredData.length > 0 ? filteredData[0] : null);
    } catch (err) {
      console.error("Error finding education by ID:", err);
      callback(null);
    }
  }

  static async educationById(id, callback) {
    try {
      const educationData = await EducationModel.getAllEducation(
        (data) => data
      );
      const foundEducation = educationData.find((el) => el.id == id);
      callback(foundEducation || null);
    } catch (err) {
      console.error("Error finding education by ID:", err);
      callback(null);
    }
  }
};
