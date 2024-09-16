const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { response } = require("express");

const User = require("../models/user");

const {JWT_SECRET} = require("../utils/config");

const {
  invalidData,
  documentNotFound,
  defaultError,
  authenticationError,
  duplicateError,
} = require("../utils/errors");

const errorHandling = (err, res) => {
  console.error(err);
  if (err.code === 11000) {
    return res.status(duplicateError).send({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(invalidData).send({ message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(invalidData).send({ message: err.message });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(documentNotFound).send({ message: err.message });
  }
  if (err.name === "AuthenticationError") {
    return res.status(authenticationError).send({ message: err.message });
  }

  return res
    .status(defaultError)
    .send({ message: "An error has occurred on the server" });
};

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};
/* 
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.create({ name, avatar, email, password })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: "Invalid data" });
      }
      
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server" });
    });
}; */

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return res.status(invalidData).send({ message: "All fields are required" });
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email })
    )
    .catch((err) => {
      if (err.code === 11000 || err.code === 409) {
        return res.status(duplicateError).send({ message: "Email already exists" })
      }
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      errorHandling(err, res);
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(invalidData).send({ message: "Email and password are required" });
  }

  if (!JWT_SECRET) {
    return res.status(500).send({ message: "JWT secret is not defined" });
  }
  return User.findUserByCredentials(email, password )
    .then((user) => {
      if(!user) {
        return res.status(authenticationError).send({message: "Invalid Email or Password"})
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

const updateProfile = (req, res) => {
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
    .catch((err) => {
      errorHandling(err, res);
    });
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  login,
  getCurrentUser,
  updateProfile,
};
