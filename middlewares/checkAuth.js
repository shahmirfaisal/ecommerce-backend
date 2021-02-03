const { errorHandler } = require("../utils");
const jwt = require("jsonwebtoken");

module.exports = (name = "admin") => {
  return (req, res, next) => {
    let token = req.get("Authorization");

    if (!token) {
      return errorHandler(next, "Unauthenticated", 401);
    }

    token = token.split(" ")[1];

    try {
      var tokenData = jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (error) {
      return errorHandler(next, "Unauthenticated", 401);
    }

    if (name === "user") req.userId = tokenData.userId;

    if (name === "admin" && tokenData.email !== process.env.ADMIN_EMAIL) {
      return errorHandler(next, "Unauthenticated", 401);
    }

    next();
  };
};
