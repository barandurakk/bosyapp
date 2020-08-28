const { db, admin } = require("../util/admin");
const config = require("../util/config");
const { validateSignUpData, validateLoginData, reduceUserDetail } = require("../util/validators");

const firebase = require("firebase");
firebase.initializeApp(config);

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
    role: "user",
    nickname: "User"
  };

  console.log(newUser);

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  const noImg = "no-img.jpg";

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ handle: "Bu nickname önceden alınmış!" });
      } else {
        return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(tokenId => {
      token = tokenId;
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        role: newUser.role,
        nickname: newUser.nickname,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already taken" });
      } else {
        return res.status(500).json({ message: "Birşeyler yanlış gitti, lütfen bir daha dene" });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if ((err.code = "auth/wrong-password")) {
        return res.status(403).json({ general: "Email veya şifre yanlış, lütfen tekrar dene" });
      }
      if ((err.code = "auth/user-not-found")) {
        return res.status(403).json({ general: "Böyle bir kullanıcı bulunmamakta." });
      } else return res.status(500).json({ error: err.code });
    });
};

//add user detail
exports.addUserDetails = (req, res) => {
  const userDetails = reduceUserDetail(req.body);
  console.log(userDetails);
  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: "Details added succesfully" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//get any user detail
exports.getUserDetails = (req, res) => {
  const userDetails = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then(data => {
      if (data.exists) {
        userDetails.user = data.data();
        return db
          .collection("boslar")
          .where("userHandle", "==", req.params.handle)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        return res.status(404).json({ error: "Kullanıcı bulunamadı!" });
      }
    })
    .then(data => {
      userDetails.boslar = [];
      data.forEach(doc => {
        userDetails.boslar.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          userHandle: doc.data().userHandle,
          userImage: doc.data().userImage,
          likeCount: doc.data().likeCount,
          commentCount: doc.data().commentCount,
          bosId: doc.id
        });
      });
      return res.json(userDetails);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//getAllUsers
exports.getAllUsers = (req, res) => {
  let usersData = [];
  db.collection("users")
    .orderBy("createdAt", "desc")
    .get()
    .then(doc => {
      doc.forEach(doc => {
        usersData.push({
          email: req.user.role === "admin" ? doc.data().email : null,
          createdAt: req.user.role === "admin" ? doc.data().createdAt : null,
          handle: doc.data().handle,
          imageUrl: doc.data().imageUrl,
          role: req.user.role === "admin" ? doc.data().role : null,
          bio: doc.data().bio,
          nickname: doc.data().nickname
        });
      });
      return res.json(usersData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//get own user details
exports.getAuthenticatedUser = (req, res) => {
  let userDetail = {};
  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(data => {
      if (data.exists) {
        userDetail.credentials = data.data();
        return db
          .collection("likes")
          .where("userHandle", "==", req.user.handle)
          .get();
      }
    })
    .then(data => {
      userDetail.likes = [];
      data.forEach(doc => {
        userDetail.likes.push(doc.data());
      });
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.handle)
        .orderBy("createdAt", "desc")
        .limit(8)
        .get();
    })
    .then(data => {
      userDetail.notifications = [];
      data.forEach(doc => {
        userDetail.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          createdAt: doc.data().createdAt,
          bosId: doc.data().bosId,
          type: doc.data().type,
          read: doc.data().read,
          notificationId: doc.id
        });
      });
      return res.json(userDetail);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//send rePass mail
exports.forgotPass = (req, res) => {
  if (req.body.email.trim() === "") {
    return res.status(400).json({ forgotEmail: "Senin gibi boş olamaz!" });
  }
  let email = req.body.email.trim();
  return db
    .collection("users")
    .where("email", "==", email)
    .limit(1)
    .get()
    .then(data => {
      if (data.size > 0) {
        data.forEach(doc => {
          return firebase.auth().sendPasswordResetEmail(doc.data().email);
        });
      } else {
        return res.status(404).json({ forgotEmail: "Böyle bir kayıt bulunamadı!" });
      }
    })
    .then(() => {
      return res.json({ message: "Email başarıyla yollandı, spam kutunuza bakmayı unutmayın!" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//upload a profile image for user
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }

    //my.image.png => ['my','image','png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    //56465465845465.png
    imageFileName = `${Math.round(Math.random() * 1000000000000).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "image upload succesfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

exports.markNotificationsRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach(notificationIds => {
    const notification = db.doc(`/notifications/${notificationIds}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      return res.json({ message: "Bildirimler okundu olarak işaretlendi" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
