const express = require("express");
const router = express.Router();
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  photo,
  getProductsByCategory,
  getProductsByShop,
} = require("../controllers/product");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");
const { categoryById } = require("../controllers/category");
const { shopById } = require("../controllers/shop");

router.get("/product/:productId", read);
router.post("/product/create/:userId", requireSignin, isAuth, isAdmin, create);
router.post("/products/by/search", listBySearch);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);

router.get("/products", list);
router.get("/product/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.get("/product/photo/:productId", photo);
router.get("/products/category/:categoryId", getProductsByCategory);
router.get("/products/shop/:shopId", getProductsByShop);

router.param("userId", userById);
router.param("productId", productById);
router.param("categoryId", categoryById);
router.param("shopId", shopById);

module.exports = router;
