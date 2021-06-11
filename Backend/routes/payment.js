const express = require("express");
const router = express.Router();
const { payment } = require("../controllers/payment");
const { productById } = require("../controllers/product");

router.post("/payment/:productId", payment);

router.param("productId", productById);

module.exports = router;
