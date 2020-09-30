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
    console.log(user)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie("t", token, { expire: new Date() + 9999 });
    const { _id, name, email, role } = user;
    return res.json({
      systemMessage: "",
      systemMessageType: "success",
      user: { token, _id, email, name, role },
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
