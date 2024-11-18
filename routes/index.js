const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

const NotFoundError = require("../errors/not-found-err");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res, next) => {
  next(new NotFoundError("non-existent page"));
});

module.exports = router;
