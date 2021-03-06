exports.userSignupValidator = (req, res, next) => {
  req.check("name", "Name is required").notEmpty();
  req
    .check("email", "Email must be between 3 to 32 characters")
    .isLength({
      min: 3,
      max: 32,
    })
    .matches(/.+\@.+\..+/)
    .withMessage("Email must contain @");
  req.check("password", "Password is required").notEmpty();
  req
    .check("password", "Password must contain at least 6 characters")
    .isLength({ min: 6 })
    .matches(/\d/)
    .withMessage("Password must contain a number");

  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({
      systemMessage: firstError,
      systemMessageType: "error",
      user: {}
    });
  }
  next();
};
