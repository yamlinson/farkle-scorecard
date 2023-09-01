const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

/*
 * Public
 */
// @desc    Login
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      return res.status(400).send("Incomplete input");
    }

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ username }, process.env.JWT_KEY, {
        expiresIn: "24h",
      });

      user.token = token;

      return res.status(200).json({
        id: user._id,
        username: user.username,
        token: user.token,
        isAdmin: user.isAdmin,
      });
    }
    return res.status(400).send("Invalid credentials");
  } catch (err) {
    console.log(err);
  }
});

module.exports = {
  loginUser,
};
