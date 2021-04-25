const Category = require("../models/category");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const formidable = require("formidable");
const _ = require("lodash");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        SystemMessage: "Image could not be uploaded",
        SystemMessageType: "error",
      });
    }
    const { name } = fields;
    if (!name) {
      return res.status(400).json({
        SystemMessageType: "error",
        SystemMessage: "All the fields are required",
      });
    }

    const category = new Category(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          SystemMessageType: "error",
          SystemMessage: "Image must be less than 1MB",
        });
      }
      category.photo.data = fs.readFileSync(files.photo.path);
      category.photo.contentType = files.photo.type;
    }
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
  });
};

exports.read = (req, res) => {
  req.category.photo = undefined;
  return res.json(req.category);
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        SystemMessage: "Image could not be uploaded",
        SystemMessageType: "error",
      });
    }
    const { name } = fields;
    if (!name) {
      return res.status(400).json({
        SystemMessageType: "error",
        SystemMessage: "All the fields are required",
      });
    }

    let category = req.category;
    category = _.extend(category, fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          SystemMessageType: "error",
          SystemMessage: "Image must be less than 1MB",
        });
      }
      category.photo.data = fs.readFileSync(files.photo.path);
      category.photo.contentType = files.photo.type;
    }

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
  Category.find()
    .select("-photo")
    .exec((err, data) => {
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

exports.photo = (req, res, next) => {
  if (req.category.photo.data) {
    res.set("Content-Type", req.category.photo.ContentType);
    return res.send(req.category.photo.data);
  }
  next();
};
