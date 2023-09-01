const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

const initAdmin = async () => {
  if (
    typeof process.env.ADMIN_USER !== undefined &&
    typeof process.env.ADMIN_PASSWORD !== undefined
  ) {
    const adminUser = await User.findOne({ username: process.env.ADMIN_USER });
    if (!adminUser) {
      password = process.env.ADMIN_PASSWORD;
      encryptedPassword = await bcrypt.hash(password, 10);

      User.create({
        _id: null,
        username: process.env.ADMIN_USER,
        password: encryptedPassword,
        isAdmin: true,
      });
    }
  }
};

module.exports = initAdmin;
