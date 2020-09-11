const { db } = require("../util/admin");

//tüm boşları göster
exports.getAllBos = (req, res) => {
  db.collection("boslar")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let boslar = [];
      data.forEach((doc) => {
        boslar.push({
          bosId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
          userNick: doc.data().userNick,
        });
      });
      return res.json(boslar);
    })
    .catch((err) => console.error(err));
};

//sınırlı boş getir
exports.getLimitedBos = (req, res) => {
  const limitAt = parseInt(req.body.limitAt);
  const lastVisible = req.body.lastVisible;

  if (!lastVisible) {
    db.collection("boslar")
      .orderBy("createdAt", "desc")
      .limit(limitAt)
      .get()
      .then((data) => {
        let boslar = [];
        data.forEach((doc) => {
          boslar.push({
            bosId: doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt,
            commentCount: doc.data().commentCount,
            likeCount: doc.data().likeCount,
            userImage: doc.data().userImage,
            userNick: doc.data().userNick,
          });
        });
        return res.json(boslar);
      })
      .catch((err) => console.error(err));
  } else {
    db.collection("boslar")
      .orderBy("createdAt", "desc")
      .startAt(lastVisible)
      .limit(limitAt)
      .get()
      .then((data) => {
        let boslar = [];
        data.forEach((doc) => {
          boslar.push({
            bosId: doc.id,
            body: doc.data().body,
            userHandle: doc.data().userHandle,
            createdAt: doc.data().createdAt,
            commentCount: doc.data().commentCount,
            likeCount: doc.data().likeCount,
            userImage: doc.data().userImage,
            userNick: doc.data().userNick,
          });
        });
        return res.json(boslar);
      })
      .catch((err) => console.error(err));
  }
};

//boş yap
exports.postOneBos = (req, res) => {
  const newBos = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    userNick: req.user.nickname,
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("boslar")
    .add(newBos)
    .then((doc) => {
      const resBos = newBos;
      resBos.bosId = doc.id;
      res.json(resBos);
    })
    .catch((err) => {
      res.status(500).json({ error: "Birşeyler yanlış gitti :/" });
      console.error(err);
    });
};

//bir boş göster
exports.getBos = (req, res) => {
  let bosData = {};
  db.doc(`/boslar/${req.params.bosId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Aradıgınız boş silinmiş veya hiç orada olmamış :(" });
      }
      bosData = doc.data();
      bosData.bosId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("bosId", "==", req.params.bosId)
        .get();
    })
    .then((data) => {
      bosData.comments = [];
      data.forEach((comment) => {
        bosData.comments.push(comment.data());
      });
      return res.json(bosData);
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//yorum yap
exports.commentOnBos = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Senin gibi boş olamaz!" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    userHandle: req.user.handle,
    bosId: req.params.bosId,
    userImage: req.user.imageUrl,
    commentId: null,
    userNick: req.user.nickname,
  };

  db.doc(`/boslar/${req.params.bosId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Böyle bir boş artık yok :(" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then((ref) => {
      newComment.commentId = ref.id;
      return db.doc(`/comments/${ref.id}`).update({ commentId: ref.id });
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Birşeyler yanlış gitti :/" });
    });
};

//Boş beğen
exports.likeBos = (req, res) => {
  const likeDoc = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("bosId", "==", req.params.bosId)
    .limit(1);

  const bosDoc = db.doc(`/boslar/${req.params.bosId}`);

  let bosData;

  bosDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        bosData = doc.data();
        bosData.bosId = doc.id;
        return likeDoc.get();
      } else {
        return res.status(404).json({ error: "Böyle bir boş artık yok :(" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            userHandle: req.user.handle,
            bosId: req.params.bosId,
          })
          .then(() => {
            bosData.likeCount++;
            return bosDoc.update({ likeCount: bosData.likeCount });
          })
          .then(() => {
            return res.json(bosData);
          });
      } else {
        return res.status(400).json({ error: "Bu Boşu zaten beğendin." });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//unlike
exports.unlikeBos = (req, res) => {
  const likeDoc = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("bosId", "==", req.params.bosId)
    .limit(1);

  const bosDoc = db.doc(`/boslar/${req.params.bosId}`);

  let bosData;

  bosDoc
    .get()
    .then((doc) => {
      if (doc.exists) {
        bosData = doc.data();
        bosData.bosId = doc.id;
        return likeDoc.get();
      } else {
        return res.status(404).json({ error: "Böyle bir boş artık yok :(" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "İlk önce beğenmelisin." });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            bosData.likeCount--;
            return bosDoc.update({ likeCount: bosData.likeCount });
          })
          .then(() => {
            res.json(bosData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//delete boş
exports.deleteBos = (req, res) => {
  db.doc(`/boslar/${req.params.bosId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).json({ error: "Böyle bir boş artık yok :(" });
      }
      if (req.user.role === "admin") {
        return db.doc(`/boslar/${req.params.bosId}`).delete();
      } else if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Bu boş senin olmadığı için silemezsin." });
      } else {
        return db.doc(`/boslar/${req.params.bosId}`).delete();
      }
    })
    .then(() => {
      res.json({ message: `Boş başarılı bir şekilde silindi.` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//edit boş
exports.editBos = (req, res) => {
  let newBody = req.body.body;
  if (newBody.trim() === "") return res.status(403).json({ editBos: "Senin gibi boş olamaz!" });
  else {
    db.doc(`/boslar/${req.params.bosId}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          return res.status(404).json({ editBos: "Böyle bir boş artık yok :/" });
        }

        if (doc.data().userHandle !== req.user.handle) {
          return res.status(403).json({ editBos: "Bu boş senin değil!" });
        }
        if (Date.now() - Date.parse(doc.data().createdAt) > 300000) {
          return res.status(403).json({ editBos: "Boş yapıldıktan sonra 5 dakika geçmiş :(" });
        }
        return db.doc(`/boslar/${req.params.bosId}`).update({ body: newBody });
      })
      .then(() => {
        res.json({ message: "Boş başarılı bir şekilde güncellendi." });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.code });
      });
  }
};

//delete comment
exports.deleteComment = (req, res) => {
  db.doc(`/comments/${req.params.commentId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        res.status(404).json({ error: "Böyle bir yorum artık yok :(" });
      }
      if (req.user.role === "admin") {
        db.doc(`/boslar/${doc.data().bosId}`)
          .get()
          .then((doc) => {
            return doc.ref.update({ commentCount: doc.data().commentCount - 1 });
          });
      } else if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Bu yorum senin olmadığı için silemezsin" });
      } else {
        db.doc(`/boslar/${doc.data().bosId}`)
          .get()
          .then((doc) => {
            return doc.ref.update({ commentCount: doc.data().commentCount - 1 });
          });
      }
    })
    .then(() => {
      db.doc(`/comments/${req.params.commentId}`).delete();
    })
    .then(() => {
      return res.json({ message: "Yorum silindi." });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
