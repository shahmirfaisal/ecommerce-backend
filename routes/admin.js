const router = require("express").Router();
const {
  postLogin,
  getIsLogin,
  getProducts,
  getProduct,
  getOrder,
  getOrders,
} = require("../controllers/admin");
const checkAuth = require("../middlewares/checkAuth");

router.post("/login", postLogin);
router.get("/is-login", checkAuth(), getIsLogin);
router.get("/product", checkAuth(), getProducts);
router.get("/product/:id", checkAuth(), getProduct);
router.get("/order", checkAuth(), getOrders);
router.get("/order/:id", checkAuth(), getOrder);

module.exports = router;
