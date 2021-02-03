const { errorHandler } = require("../utils");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

exports.postSignup = async (req, res, next) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();

  if (!name.length) {
    return errorHandler(next, "Enter name!", 422);
  }
  if (!regex.test(email)) {
    return errorHandler(next, "Invalid email!", 422);
  }
  if (password.length < 6 || password.length > 32) {
    return errorHandler(
      next,
      "Password's length should be between 6 and 32",
      422
    );
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return errorHandler(next, "Email already exists!", 422);
    }

    const user = new User({ name, email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "3d",
    });
    res.json({ token, user });
  } catch (error) {
    return errorHandler(next, error.message);
  }
};

exports.postLogin = async (req, res, next) => {
  let { email, password } = req.body;
  email = email.trim();

  try {
    const user = await User.findOne({ email }).populate("cart.items.product");

    if (!user) {
      return errorHandler(next, "Wrong email!", 422);
    }
    if (user.password !== password) {
      return errorHandler(next, "Wrong password!", 422);
    }

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "3d",
    });
    res.json({ token, user });
  } catch (error) {
    return errorHandler(next, error.message);
  }
};

exports.getIsLogin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("cart.items.product");
    if (!user) {
      return errorHandler(next, "No user found");
    }
    res.json({ user });
  } catch (error) {
    return errorHandler(next, error.message);
  }
};

exports.patchUser = async (req, res, next) => {
  let { name, email, password } = req.body;
  name = name.trim();
  email = email.trim();

  if (!name.length) {
    return errorHandler(next, "Enter name!", 422);
  }
  if (!regex.test(email)) {
    return errorHandler(next, "Invalid email!", 422);
  }
  if (password.length < 6 || password.length > 32) {
    return errorHandler(
      next,
      "Password's length should be between 6 and 32",
      422
    );
  }

  try {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id != req.userId) {
      return errorHandler(next, "Email already exists!", 422);
    }

    const user = await User.findById(req.userId);
    user.name = name;
    user.email = email;
    user.password = password;
    let newUser = await user.save();
    newUser = await User.populate(newUser, { path: "cart.items.product" });
    res.json({ user: newUser });
  } catch (error) {
    return errorHandler(next, error.message);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("cart.items.product");
    res.json({ user });
  } catch (error) {
    return errorHandler(next, error.message);
  }
};
