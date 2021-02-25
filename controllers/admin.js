const { errorHandler } = require("../utils");
const jwt = require("jsonwebtoken");
const Product = require("../models/product");
const Order = require("../models/order");

exports.postLogin = (req, res, next) => {
  let { email, password } = req.body;
  email = email.trim();

  if (email !== process.env.ADMIN_EMAIL) {
    return errorHandler(next, "Wrong email!", 422);
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return errorHandler(next, "Wrong password!", 422);
  }

  const token = jwt.sign({ email }, process.env.TOKEN_SECRET, {
    expiresIn: "3d",
  });
  res.json({ token });
};

exports.getIsLogin = (req, res, next) => res.json({ message: "Logged In" });

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("reviews.user")
      .sort({ created: -1 })
      .exec();
    res.json({ products });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id)
      .populate("category")
      .populate("reviews.user", "name");
    res.json({ product });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .sort({ date: -1 })
      .exec();
    res.json({ orders });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("items.product");
    res.json({ order });
  } catch (error) {
    errorHandler(next, error.message);
  }
};
