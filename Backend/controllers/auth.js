const User = require("../models/user");
const { errorHandler } = require("../helpers/dbErrorHandler");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
require("dotenv").config();

exports.signup = (req, res) => {
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.json({
        systemMessage: errorHandler(err),
        systemMessageType: "error",
        user: {},
      });
    }
    user.salt = undefined;
    user.hashed_password = undefined;
    res.json({
      systemMessage: "",
      systemMessageType: "success",
      user: user,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.json({
        systemMessage: "User with that email does not exist. Please signup",
        systemMessageType: "error",
        user: {},
      });
    }
    if (!user.authenticate(password)) {
      return res.json({
        systemMessage: "Email and password do not match",
        systemMessageType: "error",
        user: {},
      });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    const { _id, name, email, role, history } = user;
    return res.json({
      systemMessage: "",
      systemMessageType: "success",
      user: { token, _id, email, name, role, history },
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("t");
  res.json({ systemMessage: "SignOut Success", systemMessageType: "success" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(200).json({
      systemMessage: "Access Denied.",
      systemMessageType: "error",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    res.status(200).json({
      systemMessage: "Admin Resourse! You are not admin",
      systemMessageType: "error",
    });
  }
  next();
};
