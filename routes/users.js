const router = require("express").Router();

const auth = require("../middlewares/auth");

const { getCurrentUser, updateProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

/* const { getUsers, createUser, getUserById } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUserById);
router.post("/", createUser); */

module.exports = router;
