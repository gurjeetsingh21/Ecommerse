const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        SystemMessage: errorHandler(err),
        SystemMessageType: "error",
      });
    }
    res.json({
      SystemMessage: "",
      SystemMessageType: "success",
      category: data,
    });
  });
};

exports.read = (req, res) => {
  return res.json(req.category);
};

exports.update = (req, res) => {
  const category = req.category;
  category.name = req.body.name;
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      SystemMessageType: "success",
      SystemMessage: "",
      category: category,
    });
  });
};

exports.remove = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      SystemMessageType: "success",
      SystemMessage: "Category is successfully created",
    });
  });
};

exports.list = (req, res) => {
  Category.find().exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};

exports.categoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        SystemMessageType: "error",
        SystemMessage: "Category does not exist",
      });
    }
    req.category = category;
    next();
  });
};
