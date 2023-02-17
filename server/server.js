/*
 * Third-party Modules
 */
const express = require("express");

/*
 * Local Modules
 */
const connectDB = require("./src/config/db");

/*
 * Config
 */
require("dotenv").config();
const PORT = process.env.PORT || 8000;

/*
 * Serve Backend
 */
connectDB();
const server = express();

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Routes
server.use("/api/game", require("./src/routes/game.routes"));

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});
