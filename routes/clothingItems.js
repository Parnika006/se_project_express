const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  validateClothingItem,
  validateIDs,
} = require("../middlewares/validation");

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.post("/", auth, validateClothingItem, createItem);

router.delete("/:itemId", auth, validateIDs, deleteItem);
router.put("/:itemId/likes", auth, validateIDs, likeItem);
router.delete("/:itemId/likes", auth, validateIDs, dislikeItem);

module.exports = router;
