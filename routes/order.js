const router = require("express").Router();
const {
  postOrder,
  patchOrder,
  deleteOrder,
  getOrders,
  getOrder,
} = require("../controllers/order");
const checkAuth = require("../middlewares/checkAuth");

router.post("/", checkAuth("user"), postOrder);
router.patch("/:id", checkAuth(), patchOrder);
router.delete("/:id", checkAuth("user"), deleteOrder);
router.get("/", checkAuth("user"), getOrders);
router.get("/:id", checkAuth("user"), getOrder);

module.exports = router;
