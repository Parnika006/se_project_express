const Item = require("../models/clothingItem");

const {
  invalidData,
  documentNotFound,
  defaultError,
  forbidden,
} = require("../utils/errors");

const errorHandling = (err, res) => {
  // console.error(err);
  if (err.name === "ReferenceError") {
    return res.status(forbidden).send({ message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(invalidData).send({ message: err.message });
  }
  if (err.name === "DocumentNotFoundError") {
    return res.status(documentNotFound).send({ message: err.message });
  }

  return res
    .status(defaultError)
    .send({ message: "An error has occurred on the server" });
};

const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

const createItem = (req, res) => {
  
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  // Object.keys(req).forEach((prop) => console.log(prop));

  if (!name || !weather || !imageUrl || !owner) {
    return res.status(invalidData).send({ message: "All fields are required" });
  }

  Item.create({ name, weather, imageUrl, owner })

    .then((item) => {
     
     return res.status(201).send(item)
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(invalidData).send({ message: err.message }); 
      }
      errorHandling(err, res);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this item" });
      }
      res.send({ message: "item deleted" });
    })
    .catch((err) => {
      errorHandling(err, res);
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
      errorHandling(err, res);
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
      res.send({ message: "item disliked" });
    })
    .catch((err) => {
      errorHandling(err, res);
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
