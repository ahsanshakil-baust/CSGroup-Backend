// const { google } = require("googleapis");

const apps = require("./firebase");

// const credentials = require("./credentials.json");
// const sheetId = "1bNctI7iJgqm_wodJ27GDte9Mx-jOc2ekidvNceAGu7o";
// const range = "Sheet1!A:M";

// const auth = new google.auth.GoogleAuth({
//     credentials,
//     scopes: ["https://www.googleapis.com/auth/spreadsheets"],
// });

// const sheets = google.sheets({ version: "v4", auth });

// module.exports = class ProjectModel {
//     constructor(
//         name,
//         project_type,
//         location,
//         description,
//         land_videos,
//         project_images,
//         map_url,
//         project_structure,
//         city,
//         available,
//         category,
//         id = 0,
//         status = 1
//     ) {
//         this.id = id;
//         this.name = name;
//         this.project_type = project_type;
//         this.location = location;
//         this.description = description;
//         this.land_videos = land_videos;
//         this.project_images = project_images;
//         this.map_url = map_url;
//         this.project_structure = project_structure;
//         this.city = city;
//         this.available = available;
//         this.category = category;
//         this.status = status;
//     }

//     save(callback) {
//         ProjectModel.getAllProjects((projects) => {
//             if (this.id > 0) {
//                 projects = projects.map((project) =>
//                     project.id == this.id ? this : project
//                 );
//             } else {
//                 this.id = projects.length + 1;
//                 projects.push(this);
//             }

//             // Ensure callback is always called
//             if (callback) callback(this.id);

//             const updatedData = projects.map((project) => [
//                 project.id,
//                 project.name,
//                 project.project_type,
//                 project.location,
//                 project.description,
//                 JSON.stringify(project.land_videos),
//                 JSON.stringify(project.project_images),
//                 project.map_url,
//                 project.project_structure,
//                 project.city,
//                 project.available,
//                 project.category,
//                 project.status,
//             ]);

//             if (!sheets || !sheetId || !range) {
//                 console.error(
//                     "Missing required variables for Google Sheets API."
//                 );
//                 return;
//             }

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

//     static getAllProjects(callback) {
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
//                     const project = rows
//                         ? rows.map((row) => ({
//                               id: parseInt(row[0], 10),
//                               name: row[1],
//                               project_type: row[2],
//                               location: row[3],
//                               description: row[4],
//                               land_videos: JSON.parse(row[5] || "[]"),
//                               project_images: JSON.parse(row[6] || "[]"),
//                               map_url: row[7],
//                               project_structure: row[8],
//                               city: row[9],
//                               available: row[10],
//                               category: row[11],
//                               status: parseInt(row[12]),
//                           }))
//                         : [];

//                     callback(project);
//                 }
//             }
//         );
//     }

//     static async projectFindById(id) {
//         return new Promise((resolve, reject) => {
//             ProjectModel.getAllProjects((projects) => {
//                 if (!projects) return reject(new Error("No projects found"));

//                 const project =
//                     projects.find((project) => project.id == id) || null;
//                 resolve(project);
//             });
//         });
//     }
// };

// const db = require("./firebase");
const db = apps.app3.firestore();
const collectionName = "projects";

module.exports = class ProjectModel {
    constructor(
        name,
        project_type,
        location,
        description,
        land_videos = [],
        project_images = [],
        map_url,
        project_structure,
        city,
        // available,
        category,
        feature_images = [],
        id = null,
        status = 1
    ) {
        this.id = id;
        this.name = name;
        this.project_type = project_type;
        this.location = location;
        this.description = description;
        this.land_videos = land_videos;
        this.project_images = project_images;
        this.map_url = map_url;
        this.project_structure = project_structure;
        this.city = city;
        // this.available = available;
        this.category = category;
        this.feature_images = feature_images;
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

            console.log("Project saved to Firebase.");
        } catch (error) {
            console.error("Error saving project to Firebase:", error);
        }
    }

    static async getAllProjects(callback) {
        try {
            const snapshot = await db.collection(collectionName).get();
            const projects = snapshot.docs.map((doc) => doc.data());
            callback(projects);
        } catch (error) {
            console.error("Error fetching projects from Firebase:", error);
            callback([]);
        }
    }

    static async projectFindById(id) {
        try {
            const doc = await db
                .collection(collectionName)
                .doc(id.toString())
                .get();
            if (!doc.exists) return null;
            return doc.data();
        } catch (error) {
            console.error("Error finding project by ID:", error);
            return null;
        }
    }
};
