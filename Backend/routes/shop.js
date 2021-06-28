const express = require("express");
const router = express.Router();

const {
  create,
  shopById,
  read,
  update,
  remove,
  list,
} = require("../controllers/shop");

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");

const { userById } = require("../controllers/user");

router.get("/shop/:shopId", read);
router.post("/shop/create/:userId", requireSignin, isAuth, isAdmin, create);
router.put("/shop/:shopId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/shop/:shopId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/shops", list);

router.param("shopId", shopById);
router.param("userId", userById);

module.exports = router;
