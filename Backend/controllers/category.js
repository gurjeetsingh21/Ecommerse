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
        systemMessage: "Image could not be uploaded",
        systemMessageType: "error",
      });
    }
    const { name } = fields;
    if (!name) {
      return res.status(400).json({
        systemMessageType: "error",
        systemMessage: "All the fields are required",
      });
    }
    Category.findOne({ name }, (err, category) => {
      if (category) {
        return res.json({
          systemMessage: "Category with that name already exists",
          systemMessageType: "error",
        });
      }
      const newCategory = new Category(fields);

      if (files.photo) {
        if (files.photo.size > 1000000) {
          return res.status(400).json({
            systemMessageType: "error",
            systemMessage: "Image must be less than 1MB",
          });
        }
        newCategory.photo.data = fs.readFileSync(files.photo.path);
        newCategory.photo.contentType = files.photo.type;
      }
      newCategory.save((err, data) => {
        if (err) {
          return res.status(400).json({
            systemMessage: errorHandler(err),
            systemMessageType: "error",
          });
        }
        res.json({
          systemMessage: "",
          systemMessageType: "success",
          category: data,
        });
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
        systemMessage: "Image could not be uploaded",
        systemMessageType: "error",
      });
    }
    const { name } = fields;
    if (!name) {
      return res.status(400).json({
        systemMessageType: "error",
        systemMessage: "All the fields are required",
      });
    }

    let category = req.category;
    category = _.extend(category, fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          systemMessageType: "error",
          systemMessage: "Image must be less than 1MB",
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
        systemMessageType: "success",
        systemMessage: "",
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
      systemMessageType: "success",
      systemMessage: "Category is successfully created",
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
        systemMessageType: "error",
        systemMessage: "Category does not exist",
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
