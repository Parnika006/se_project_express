const Item = require("../models/clothingItem");

// const { errorHandling } = require("../utils/errors");

const ForbiddenError = require("../errors/forbidden-error");

const BadRequestError = require("../errors/bad-request-err");

const NotFoundError = require("../errors/not-found-err");

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
  
  // Object.keys(req).forEach((prop) => console.log(prop));

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
     
      res.status(201).send(item);
    })
    // .catch((err) => {errorHandling(err, res)});
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (String(item.owner) !== req.user._id) {
        //  return res.status(forbidden).send({ message: "forbidden" });
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return item.deleteOne();
    })
    .then(() => res.status(200).send({ message: "Successfuly Deleted" }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
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
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
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
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("The id string is in an invalid format"));
      } else {
        next(err);
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
