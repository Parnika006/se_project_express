const Item = require("../models/clothingItem");

const {
  invalidData,
  documentNotFound,
  defaultError,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.status(200).send(items);
    })
    .catch((err) => {
      console.error(err);
      return res.status(defaultError).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  // console.log("inside createItem method");
  // console.log(`user id print ${req.user._id}`);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  // Object.keys(req).forEach((prop) => console.log(prop));

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(200).send({ message: "item deleted" });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(invalidData).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFound).send({ message: err.message });
      }
      return res.status(defaultError).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  // console.log("in like item method");
  // Object.keys(req).forEach((prop) => console.log(prop));
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then(() => {
      res.status(201).send({ message: "item liked" });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(invalidData).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFound).send({ message: err.message });
      }

      return res.status(defaultError).send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then(() => {
      res.status(200).send({ message: "item disliked" });
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(invalidData).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        return res.status(documentNotFound).send({ message: err.message });
      }

      return res.status(defaultError).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
