const router = require("express").Router();
const {
  postSignup,
  postLogin,
  getIsLogin,
  patchUser,
  getUser,
} = require("../controllers/user");
const checkAuth = require("../middlewares/checkAuth");

router.post("/signup", postSignup);
router.post("/login", postLogin);
router.get("/is-login", checkAuth("user"), getIsLogin);
router.patch("/", checkAuth("user"), patchUser);
router.get("/", checkAuth("user"), getUser);

module.exports = router;
