const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const orderRoutes = require("./routes/order");

const app = express();

app.use(express.json());

app.use(cors());

app.use("/admin", adminRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);
app.use("/order", orderRoutes);

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  app.listen(process.env.PORT || 5000, () => console.log("Listening at 5000!"));
})();
