const Shop = require("../models/shop");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.shopById = (req, res, next, id) => {
  Shop.findById(id).exec((err, shop) => {
    if (err || !shop) {
      return res.status(400).json({
        systemMessage: "Shop not found",
        systemMessageType: "error",
      });
    }
    req.shop = shop;
    next();
  });
};

exports.read = (req, res) => {
  return res.json(req.shop);
};

exports.create = async (req, res) => {
  await Shop.findOne({ email: req.body.email }, (err, shop) => {
    if (shop) {
      return res.status(400).json({
        systemMessageType: "error",
        systemMessage: "A shop has already been created for this account.",
      });
    }
  });
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
  let hashed_password = "";
  await Shop.findOne({ email: req.shop.email }, (err, shop) => {
    const { password } = req.body;
    if (password) {
      hashed_password = shop.encryptPassword(password);
      delete req.body.password;
      req.body.hashed_password = hashed_password;
    }
  });
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

exports.getShopByUserId = (req, res) => {
  console.log(req.profile);
  Shop.findOne({ email: req.profile.email }, (err, shop) => {
    console.log(shop);
    if (err || !shop) {
      return res.json({
        systemMessage:
          "Shop of this user does not exist. Please register you shop",
        systemMessageType: "error",
      });
    }
    res.json({
      systemMessage: "",
      systemMessageType: "success",
      shop: shop,
    });
  });
};
