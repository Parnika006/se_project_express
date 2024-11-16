const Item = require("../models/clothingItem");

// const { errorHandling } = require("../utils/errors");

const ForbiddenError = require("../errors/forbidden-error");
const DuplicateError = require("../errors/conflict-err");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => {
      res.send(items);
    })
    .catch(next);
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  console.log(req.body);
  // Object.keys(req).forEach((prop) => console.log(prop));

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(201).send(item);
    })
    // .catch((err) => {errorHandling(err, res)});
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        //  return res.status(forbidden).send({ message: "forbidden" });
        throw new ForbiddenError("Forbidden");
      }
      return Item.deleteOne().then(() =>
        res.status(200).send({ message: "Successfuly Deleted" })
      );
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  // console.log("in like item method");
  // Object.keys(req).forEach((prop) => console.log(prop));
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(201).send(item);
    })
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch(next);
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
