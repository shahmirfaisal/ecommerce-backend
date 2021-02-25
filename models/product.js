const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  sold: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      order: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Order",
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  rating: {
    type: Number,
    default: null,
  },
  status: {
    type: String,
    required: true,
    enum: ["PRIVATE", "PUBLIC"],
  },
});

productSchema.methods.addReview = async function (
  user,
  order,
  rating,
  comment
) {
  const reviewExist = this.reviews.find((review) => review.order == order);

  if (reviewExist) throw new Error("Already reviewed!");

  const review = { user, order, rating, comment };
  this.reviews = [review, ...this.reviews];
  this.rating =
    this.reviews.reduce((total, review) => total + review.rating, 0) /
    this.reviews.length;

  const product = await this.save();
  return product;
};

productSchema.statics.incrementSold = function () {
  console.log(this);
};

module.exports = mongoose.model("Product", productSchema);
