const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { documentNotFound } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  if (res.status === documentNotFound) {
    res.send({ message: "Requested resource not found" });
  }
});

module.exports = router;
