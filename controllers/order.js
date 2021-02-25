const { errorHandler } = require("../utils");
const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

exports.postOrder = async (req, res, next) => {
  const { country, city, address1, address2, zipCode } = req.body;

  try {
    const user = await User.findById(req.userId);
    const order = new Order({
      user: user._id,
      ...user.cart,
      shippingAddress: {
        country,
        city,
        address1,
        address2,
        zipCode,
      },
    });
    await order.save();

    user.cart.items.forEach(async (item) => {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { sold: item.quantity } }
      );
    });

    const newUser = await user.emptyCart();

    res.json({ user: newUser, order });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.patchOrder = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    order.status = status;
    const newOrder = await order.save();
    res.json({ order: newOrder });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.deleteOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({ _id: id, user: req.userId });
    if (order.status !== "DELIVERED") {
      throw new Error("Order isn't completed yet!");
    }
    await Order.deleteOne({ _id: id, user: req.userId });
    res.json({ order });
  } catch (error) {
    errorHandler(next, error.message);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.userId })
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
    const order = await Order.findOne({ _id: id, user: req.userId }).populate(
      "items.product"
    );
    res.json({ order });
  } catch (error) {
    errorHandler(next, error.message);
  }
};
