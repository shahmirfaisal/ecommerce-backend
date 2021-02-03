const router = require("express").Router();
const {
  postProduct,
  patchProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getCategoryProducts,
  postReview,
} = require("../controllers/product");
const checkAuth = require("../middlewares/checkAuth");

router.post("/", checkAuth(), postProduct);
router.patch("/:id", checkAuth(), patchProduct);
router.delete("/:id", checkAuth(), deleteProduct);
router.get("/:id", getProduct);
router.get("/", getProducts);
router.get("/category/:id", getCategoryProducts);
router.post("/:id/review", checkAuth("user"), postReview);

module.exports = router;
