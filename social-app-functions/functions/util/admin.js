const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://social-app-f0b76.firebaseio.com",
  storageBucket: "social-app-f0b76.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };
