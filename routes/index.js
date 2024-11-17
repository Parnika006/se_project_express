const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const DocumentNotFoundError = require("../errors/not-found-err");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(DocumentNotFoundError).send({
    message: "Requested resource not found",
  });
});

module.exports = router;
