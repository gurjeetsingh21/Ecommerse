const Shop = require("../models/shop");

exports.shopById = (req, res, next, id) => {
  Shop.findById(id).exec((err, shop) => {
    if (err || !shop) {
      return res.status(400).json({
        systemMessage: "Shop not found",
        systemMessageType: "error",
      });
    }
    req.profile = shop;
    next();
  });
};

exports.read = (req, res) => {
  return res.json(req.profile);
};

exports.create = (req, res) => {
  const shop = new Shop(req.body);
  shop.save((err, shop) => {
    if (err) {
      return res.json({
        systemMessage: errorHandler(err),
        systemMessageType: "error",
        shop: {},
      });
    }
    res.json({
      systemMessage: "",
      systemMessageType: "success",
      shop: shop,
    });
  });
};

exports.update = async (req, res) => {
  Shop.findOneAndUpdate(
    { _id: req.shop._id },
    { $set: req.body },
    { new: true },
    (err, shop) => {
      if (err) {
        return res.status(400).json({
          systemMessageType: "error",
          SystemMessage: "You are not authorized to perform this action",
        });
      }
      res.json({
        systemMessage: "",
        systemMessageType: "success",
        shop: shop,
      });
    }
  );
};

exports.remove = (req, res) => {
  let shop = req.shop;
  shop.remove((err, deletedShop) => {
    if (err) {
      return res.status(400).json({
        systemMessage: errorHandler(err),
        systemMessageType: "error",
      });
    }
    res.json({
      systemMessageType: "success",
      systemMessage: "Shop is successfully Deleted",
    });
  });
};

exports.list = (req, res) => {
  Shop.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
