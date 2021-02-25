const { errorHandler } = require("../utils");
const Product = require("../models/product");
const Category = require("../models/category");

exports.postProduct = async (req, res, next) => {
  let {
    name,
    description,
    image,
    category,
    quantity,
    price,
    status,
  } = req.body;
  name = name.trim();
  description = description.trim();
  image = image.trim();

  try {
    if (!name.length) {
      return errorHandler(next, "Enter name!", 422);
    }
    if (!description.length) {
      return errorHandler(next, "Enter description!", 422);
    }
    if (!image.length) {
      return errorHandler(next, "Upload image!", 422);
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return errorHandler(next, "Category not found!", 422);
    }
    if (!quantity) {
      return errorHandler(next, "Quantity shouldn't be 0!", 422);
    }
    if (!price) {
      return errorHandler(next, "Price shouldn't be 0!", 422);
    }
    if (status !== "PRIVATE" && status !== "PUBLIC") {
      return errorHandler(
        next,
        "Status should either be PRIVATE or PUBLIC!",
        422
      );
    }

    let product = new Product({
      name,
      description,
      image,
      category,
      quantity,
      price,
      status,
    });
    await product.save();
    product = await Product.populate(product, { path: "category" });
    res.json({ product });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.patchProduct = async (req, res, next) => {
  const { id } = req.params;

  let {
    name,
    description,
    image,
    category,
    quantity,
    price,
    status,
  } = req.body;
  name = name.trim();
  description = description.trim();
  image = image.trim();

  try {
    if (!name.length) {
      return errorHandler(next, "Enter name!", 422);
    }
    if (!description.length) {
      return errorHandler(next, "Enter description!", 422);
    }
    if (!image.length) {
      return errorHandler(next, "Upload image!", 422);
    }
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return errorHandler(next, "Category not found!", 422);
    }
    if (!price) {
      return errorHandler(next, "Price shouldn't be 0!", 422);
    }
    if (status !== "PRIVATE" && status !== "PUBLIC") {
      return errorHandler(
        next,
        "Status should either be PRIVATE or PUBLIC!",
        422
      );
    }

    let product = await Product.findById(id);
    product.name = name;
    product.description = description;
    product.image = image;
    product.category = category;
    product.status = status;
    product.quantity = quantity;
    product.price = price;
    await product.save();
    product = await Product.populate(product, { path: "category" });
    res.json({ product });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findOneAndDelete({ _id: id });
    res.json({ product });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findOne({
      _id: id,
      status: "PUBLIC",
    })
      .populate("category")
      .populate("reviews.user", "name");
    res.json({ product });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getProducts = async (req, res, next) => {
  const { search } = req.query;

  const regex = new RegExp(search, "gi");

  try {
    if (search) {
      var products = await Product.find({
        status: "PUBLIC",
        name: { $regex: regex },
      })
        .populate("category")
        .sort({ created: -1 })
        .exec();
    } else {
      var products = await Product.find({ status: "PUBLIC" })
        .populate("category")
        .sort({ created: -1 })
        .exec();
    }

    res.json({ products });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getCategoryProducts = async (req, res, next) => {
  const { id } = req.params;
  try {
    const products = await Product.find({
      category: id,
      status: "PUBLIC",
    })
      .populate("category")
      .sort({ created: -1 })
      .exec();
    res.json({ products });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.postReview = async (req, res, next) => {
  const { id } = req.params;
  let { order, rating, comment } = req.body;
  comment = comment.trim();

  if (!comment.length) {
    errorHandler(next, "Enter the review!", 422);
  }
  if (rating < 1 || rating > 5) {
    errorHandler(next, "Give rating!", 422);
  }

  try {
    let product = await Product.findById(id);
    product = await product.addReview(req.userId, order, rating, comment);
    res.json({ product });
  } catch (error) {
    errorHandler(next, error.message);
  }
};
