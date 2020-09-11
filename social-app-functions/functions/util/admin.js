const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("../CREDENTIALS.json")),
  databaseURL: "https://social-app-f0b76.firebaseio.com",
  storageBucket: "social-app-f0b76.appspot.com",
});

const db = admin.firestore();

module.exports = { admin, db };
