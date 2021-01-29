const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  app.listen(process.env.PORT || 5000, () => console.log("Listening at 5000!"));
})();
