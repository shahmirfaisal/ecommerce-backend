const router = require("express").Router();
const {
  postCategory,
  patchCategory,
  deleteCategory,
  getCategory,
  getCategories,
} = require("../controllers/category");
const checkAuth = require("../middlewares/checkAuth");

router.post("/", checkAuth(), postCategory);
router.patch("/:id", checkAuth(), patchCategory);
router.delete("/:id", checkAuth(), deleteCategory);
router.get("/:id", getCategory);
router.get("/", getCategories);

module.exports = router;
