const { errorHandler } = require("../utils");
const User = require("../models/user");

exports.postCart = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const { productId } = req.params;

  try {
    let newUser = await user.addToCart(productId);
    newUser = await User.populate(newUser, { path: "cart.items.product" });
    res.json({ user: newUser });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.decrementFromCart = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const { productId } = req.params;

  try {
    let newUser = await user.decrementFromCart(productId);
    newUser = await User.populate(newUser, { path: "cart.items.product" });
    res.json({ user: newUser });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.deleteFromCart = async (req, res, next) => {
  const user = await User.findById(req.userId);
  const { productId } = req.params;

  try {
    let newUser = await user.deleteFromCart(productId);
    newUser = await User.populate(newUser, { path: "cart.items.product" });
    res.json({ user: newUser });
  } catch (error) {
    errorHandler(next, error.message);
  }
};
