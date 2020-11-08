const formidable = require("formidable");
const _ = require("lodash");
const Product = require("../models/product");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        SystemMessage: "Image cloud not be uploaded",
        SystemMessageType: "error",
      });
    }
    let product = new Product(fields);

    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, data) => {
      if (err) {
        res.status(400).json({
          SystemMessage: errorHandler(err),
          SystemMessageType: "error",
        });
      }
      res.json({
        SystemMessage: "",
        SystemMessageType: "success",
        product: data,
      });
    });
  });
};
