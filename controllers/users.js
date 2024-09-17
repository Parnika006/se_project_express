const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");


const User = require("../models/user");

const {JWT_SECRET} = require("../utils/config");


const {errorHandling, invalidData, authenticationError} = require("../utils/errors")



const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!name || !avatar || !email || !password) {
    return res.status(invalidData).send({ message: "All fields are required" });
  }

 return bcrypt
    .hash(password, 10)
    .then((hash) =>  User.create({ name, avatar, email, password: hash }) )
    .then((user) =>  res.status(201).send({ name: user.name, avatar: user.avatar, email: user.email }))
    .catch((err) => errorHandling(err, res));
};



const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(invalidData).send({ message: "Email and password are required" });
  }

 
  return User.findUserByCredentials(email, password )
    .then((user) => {
      if(!user) {
        return res.status(authenticationError).send({message: "Invalid Email or Password"})
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
       return res.send({ token });
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
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
