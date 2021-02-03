const { errorHandler } = require("../utils");
const Category = require("../models/category");

exports.postCategory = async (req, res, next) => {
  let { name } = req.body;
  name = name.trim();

  if (!name.length) {
    return errorHandler(next, "Enter name!", 422);
  }

  try {
    const category = new Category({ name });
    await category.save();
    res.json({ category });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.patchCategory = async (req, res, next) => {
  const { id } = req.params;
  let { name } = req.body;
  name = name.trim();

  if (!name.length) {
    return errorHandler(next, "Enter name!", 422);
  }

  try {
    const category = await Category.findById(id);
    category.name = name;
    const newCategory = await category.save();
    res.json({ category: newCategory });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findOneAndDelete({ _id: id });
    res.json({ category });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    res.json({ category });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (error) {
    errorHandler(next, error.message);
  }
};
