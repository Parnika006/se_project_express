const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const helmet = require("helmet");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const limiter = require("./utils/rateLimiter");

const {
  validateLoggingIn,
  validateUserInfo,
} = require("./middlewares/validation");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(cors());

app.use(requestLogger); // before the routes

/* app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
}); */ // had to be removed after code review

app.post("/signin", validateLoggingIn, login);
app.post("/signup", validateUserInfo, createUser);

app.use("/", mainRouter);

app.use(errorLogger); // before the other error handlers

app.use(errors()); // celebrate errors

app.use(errorHandler); // after all other app.use statements

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
