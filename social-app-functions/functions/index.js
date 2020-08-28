const express = require("express");
const functions = require("firebase-functions");
const app = express();
const bodyParser = require("body-parser");
const { db } = require("./util/admin");

const FBAuth = require("./util/FBAuth");

const cors = require("cors");
app.use(cors());

const {
  getAllBos,
  postOneBos,
  getBos,
  commentOnBos,
  likeBos,
  unlikeBos,
  deleteBos,
  deleteComment,
  editBos
} = require("./handlers/boslar");
const {
  login,
  signup,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead,
  getAllUsers,
  forgotPass
} = require("./handlers/users");

//boş routes
app.get("/boslar", getAllBos); //Tüm boşları al
app.post("/bosyap", FBAuth, postOneBos); //Boş yap
app.get("/boslar/:bosId", getBos); //Id'ye göre boş ve yorumlarını çek
app.get("/boslar/:bosId/delete", FBAuth, deleteBos); //bir boş sil
app.get("/boslar/:bosId/like", FBAuth, likeBos); //bir boş beğen
app.get("/boslar/:bosId/unlike", FBAuth, unlikeBos); // bir boş beğenme
app.post("/boslar/:bosId/comment", FBAuth, commentOnBos); //Boş'a yorum yap
app.post("/boslar/:bosId/update", FBAuth, editBos); //Boş güncelle

//user routes
app.post("/signup", signup); //Üye ol
app.post("/login", login); //Giriş yap
app.post("/user/image", FBAuth, uploadImage); //Resim yükle
app.post("/user", FBAuth, addUserDetails); //Kullanıcı detayı ekle
app.get("/user", FBAuth, getAuthenticatedUser); //Giriş yapmış kullanıcı bilgilerini getir
app.get("/user/:handle", getUserDetails); //Bir kullanıcının bilgilerini getir
app.post("/notifications", FBAuth, markNotificationsRead);
app.get("/users", FBAuth, getAllUsers); //Tüm kullanıcıları getir
app.post("/user/forgotPass", forgotPass); //Şifremi unuttum maili

//comments
app.get("/comments/:commentId/delete", FBAuth, deleteComment); //bir yorum sil

exports.api = functions.region("europe-west1").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/boslar/${snapshot.data().bosId}`)
      .get()
      .then(doc => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            bosId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

exports.deleteNotificationOnUnLike = functions
  .region("europe-west1")
  .firestore.document("likes/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
      });
  });

exports.deleteNotificationOnCommentDelete = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onDelete(snapshot => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch(err => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    return db
      .doc(`/boslar/${snapshot.data().bosId}`)
      .get()
      .then(doc => {
        if (doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            bosId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("europe-west1")
  .firestore.document("/users/{id}")
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("resim değişti");
      const batch = db.batch();
      return db
        .collection("boslar")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const bos = db.doc(`/boslar/${doc.id}`);
            batch.update(bos, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else if (change.before.data().nickname !== change.after.data().nickname) {
      console.log("nickname değişti");
      const batch = db.batch();
      return db
        .collection("boslar")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then(data => {
          data.forEach(doc => {
            const bos = db.doc(`/boslar/${doc.id}`);
            batch.update(bos, { userNick: change.after.data().nickname });
          });
          return batch.commit();
        });
    } else return true;
  });

// exports.onNicknameChange = functions
//   .region("europe-west1")
//   .firestore.document("/users/{id}")
//   .onUpdate(change => {
//     if (change.before.data().nickname !== change.after.data().nickname) {
//       console.log(change.before.data().nickname);
//       console.log(change.after.data().nickname);
//       const batch = db.batch();
//       return db
//         .collection("boslar")
//         .where("userHandle", "==", change.before.data().handle)
//         .get()
//         .then(data => {
//           data.forEach(doc => {
//             const bos = db.doc(`/boslar/${doc.id}`);
//             if (data.data().userNick !== undefined) {
//               batch.update(bos, { userNick: change.after.data().nickname });
//             } else return batch.update(bos, { userNick: change.after.data().handle });
//           });
//           return batch.commit();
//         });
//     } else return true;
//   });

exports.onBosDelete = functions
  .region("europe-west1")
  .firestore.document("/boslar/{bosId}")
  .onDelete((snapshot, context) => {
    const bosId = context.params.bosId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("bosId", "==", bosId)
      .get()
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection("likes")
          .where("bosId", "==", bosId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("bosId", "==", bosId)
          .get();
      })
      .then(data => {
        data.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  });
