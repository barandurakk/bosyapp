const { admin, db } = require("./admin");

module.exports = (req, res, next) => {
  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found.");
    res.status(403).json({ error: "Unauthorized" });
  }

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.user = decodedToken;

      return db.collection("users").where("userId", "==", req.user.uid).limit(1).get();
    })
    .then((data) => {
      req.user.handle = data.docs[0].data().handle;
      req.user.role = req.user.role ? data.docs[0].data().role : data.docs[0].data().handle;
      req.user.imageUrl = data.docs[0].data().imageUrl;
      req.user.nickname = data.docs[0].data().nickname;
      return next();
    })
    .catch((err) => {
      console.error("Error while verifying token", err);
      return res.status(403).json(err);
    });
};
