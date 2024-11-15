const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/bad-request-err");
const AuthenticationError = require("../errors/authentication-err");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    //  return res.status(invalidData).send({ message: "All fields are required" });
    throw new BadRequestError("All fields are required");
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email })
    )
    .catch(next); // euquivalent to .catch(err => next(err))
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    /*  return res
      .status(invalidData)
      .send({ message: "Email and password are required" }); */
    throw new BadRequestError("Email and password are required");
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        /*    return res
          .status(authenticationError)
          .send({ message: "Invalid Email or Password" }); */
        throw new AuthenticationError("Invalid Email or Password");
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.send({ token, user });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.status(200).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
