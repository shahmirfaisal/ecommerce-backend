const router = require("express").Router();
const {
  postCart,
  decrementFromCart,
  deleteFromCart,
} = require("../controllers/cart");
const checkAuth = require("../middlewares/checkAuth");

router.post("/:productId", checkAuth("user"), postCart);
router.delete("/decrement/:productId", checkAuth("user"), decrementFromCart);
router.delete("/:productId", checkAuth("user"), deleteFromCart);

module.exports = router;
