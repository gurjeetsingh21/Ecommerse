const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  signout,
  requireSignin,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

router.post("/signup", userSignupValidator, signup);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
