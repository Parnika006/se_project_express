const Item = require("../models/clothingItem");


const {errorHandling, forbidden} = require("../utils/errors");
 

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

 
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {res.status(201).send(item)})
    .catch((err) => {errorHandling(err, res)});
};

const deleteItem = (req, res) => {
 
  const { itemId } = req.params;
Item.findById(itemId)
.orFail()
.then((item) => {

  if(String(item.owner) !== req.user._id) {
    return res.status(forbidden).send({message: "forbidden"});
  }
  return Item.deleteOne().then(() => res.status(200).send({message: "Successfuly Deleted"}));
})
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
