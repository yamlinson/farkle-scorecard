const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");

const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req.headers.authorization.split(" ")[1] ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Token required with request");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    req.user = await User.findOne(decoded.username).select("-password");
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
  return next();
});

module.exports = verifyToken;
