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
