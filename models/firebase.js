// // firebase.js or firebase.ts
// const admin = require("firebase-admin");
// const serviceAccount = require("./serviceAccountKey.json");

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// const db = admin.firestore();
// module.exports = db;

const admin = require("firebase-admin");
const serviceAccount1 = require("./serviceAccountKey.json");
const serviceAccount2 = require("./serviceAccountKey2.json");
const serviceAccount3 = require("./serviceAccountKey3.json");
const serviceAccount4 = require("./serviceAccountKey4.json");

const apps = {};

// Initialize the first app
if (!admin.apps.some((app) => app.name === "app1")) {
    apps.app1 = admin.initializeApp(
        {
            credential: admin.credential.cert(serviceAccount1),
        },
        "app1"
    );
}

// Initialize the second app
if (!admin.apps.some((app) => app.name === "app2")) {
    apps.app2 = admin.initializeApp(
        {
            credential: admin.credential.cert(serviceAccount2),
        },
        "app2"
    );
}

// Initialize the second app
if (!admin.apps.some((app) => app.name === "app3")) {
    apps.app3 = admin.initializeApp(
        {
            credential: admin.credential.cert(serviceAccount3),
        },
        "app3"
    );
}

// Initialize the second app
if (!admin.apps.some((app) => app.name === "app4")) {
    apps.app4 = admin.initializeApp(
        {
            credential: admin.credential.cert(serviceAccount4),
        },
        "app4"
    );
}

module.exports = apps;
