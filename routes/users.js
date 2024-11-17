const router = require("express").Router();

const auth = require("../middlewares/auth");

const { getCurrentUser, updateProfile } = require("../controllers/users");

const { validateUpdatedUserInfo } = require("../middlewares/validation");

router.get("/me", auth, validateUpdatedUserInfo, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
