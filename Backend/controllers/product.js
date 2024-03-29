const formidable = require("formidable");
const _ = require("lodash");
const Product = require("../models/product");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        systemMessage: "Product not found",
        systemMessageType: "error",
      });
    }
    req.product = product;
    next();
  });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.send(req.product);
};

exports.getProductsByCategory = (req, res) => {
  Product.find({ category: { _id: req.category._id, name: req.category.name } })
    .select("-photo")
    .populate("category", "_id name")
    .populate("shop", "_id name pincode email")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          systemMessage: "Product not found",
          systemMessageType: "error",
        });
      }
      res.send(products);
    });
};

exports.getProductsByShop = (req, res) => {
  Product.find({ shop: { _id: req.shop._id } })
    .select("-photo")
    .populate("category", "_id name")
    .populate("shop", "_id name pincode email")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          systemMessage: "Product not found",
          systemMessageType: "error",
        });
      }
      res.send(products);
    });
};

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
    // check for fields
    const { name, description, price, category, quantity, shipping, author } =
      fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping ||
      !author
    ) {
      return res.status(400).json({
        systemMessageType: "error",
        systemMessage: "All the fields are required",
      });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          systemMessageType: "error",
          systemMessage: "Image must be less than 1MB",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, data) => {
      if (err) {
        res.status(400).json({
          systemMessage: err,
          systemMessageType: "error",
        });
      }
      res.json({
        systemMessage: "",
        systemMessageType: "success",
        product: data,
      });
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        systemMessage: errorHandler(err),
        systemMessageType: "error",
      });
    }
    res.json({
      systemMessageType: "success",
      systemMessage: "Product is successfully Deleted",
    });
  });
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
    // check for fields
    const {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      author,
      shop,
    } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping ||
      !author ||
      !shop
    ) {
      return res.status(400).json({
        systemMessageType: "error",
        systemMessage: "All the fields are required",
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          systemMessageType: "error",
          systemMessage: "Image must be less than 1MB",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, data) => {
      if (err) {
        res.status(400).json({
          systemMessage: errorHandler(err),
          systemMessageType: "error",
        });
      }
      res.json({
        systemMessage: "",
        systemMessageType: "success",
        product: data,
      });
    });
  });
};

/**
 *  sell arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent then all products are sent
 */

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select("-photo")
    .populate("category", "_id name")
    .populate("shop", "_id name pincode email")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          systemMessage: "Product not found",
          systemMessageType: "error",
        });
      }
      res.send(data);
    });
};

/**
 * it will find the product based on the req product category
 * other products that have the same category, will be returned
 */
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .populate("shop", "_id name pincode email")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          systemMessage: "Product not found",
          systemMessageType: "error",
        });
      }
      res.send(products);
    });
};

exports.listCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        systemMessageType: "error",
        systemMessage: "Sorry, this category is not available right now!!",
      });
    }
    res.send(categories);
  });
};

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .populate("shop")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          systemMessage: "Product not found",
          systemMessageType: "error",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    // assigne category value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(products);
    })
      .select("-photo")
      .populate("category")
      .populate("shop");
  }
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.ContentType);
    return res.send(req.product.photo.data);
  }
  next();
};
