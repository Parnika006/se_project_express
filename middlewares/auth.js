const jwt = require("jsonwebtoken");
// const authenticationError = require("../utils/errors");

const {JWT_SECRET} = require("../utils/config");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  console.log(JSON.stringify(req.headers));
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(401).send({ message: "Authorization Required" });
  }

  req.user = payload;
  next();
};