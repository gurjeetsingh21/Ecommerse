const user = require("../models/user");

exports.userById = (req, res, next, id) => {
  user.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        systemMessage: "User not found",
        systemMessageType: "error",
      });
    }
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  user.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          systemMessageType: "error",
          SystemMessage: "You are not authorized to perform this action",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};
