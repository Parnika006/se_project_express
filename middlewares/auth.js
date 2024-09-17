const jwt = require("jsonwebtoken");


const {JWT_SECRET} = require("../utils/config");
const { authenticationError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(authenticationError).send({ message: "Authorization Required" });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(authenticationError).send({ message: "Authorization Required" });
  }

   req.user = payload;
 return next(); 
  
};
