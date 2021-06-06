const express = require("express");
const router = express.Router();
const { payment } = require("../controllers/payment");

router.post("/payment", payment);

module.exports = router;
