/**
 * app.js
 *
 * This file sets up and configures the Express application. Specifically, it:
 * 1. Imports required libraries and middleware.
 * 2. Sets up the Express instance and middleware used for body parsing, logging, etc.
 * 3. Imports and configures the application's routes.
 * 4. Handles errors and provides appropriate responses.
 *
 */

// Import required modules
const express = require("express");
const cors = require("cors");
const userManagementDB = require("./services/postgresql");
const userGroupPlatformDB = require("./services/mongodb");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/UserRoutes");
const platformRoutes = require("./routes/PlatformRoutes");
const taskRoutes = require("./routes/TaskRoutes");
const eventRoutes = require("./routes/EventRoutes");
const summaryRoutes = require("./routes/SummaryRoutes");
const groupRoutes = require("./routes/GroupRoutes");

// Create an instance of Express
const app = express();
userManagementDB.testConnection();
userGroupPlatformDB.testConnection();

// Middleware setup

// Enable CORS (Cross-Origin Resource Sharing) for all routes
app.use(cors());

// Use bodyParser to parse JSON payloads
app.use(bodyParser.json());

// TODO: Check DB health too
app.use("/users/api/v1/health", function (req, res) {
  // check the userManagementDB and userGroupPlatformDB health
  try {
    userManagementDB.testConnection();
    userGroupPlatformDB.testConnection();
    res.status(200).send({ message: "Service is healthy" });
  } catch (error) {
    res.status(500).send({ message: "Service is not healthy" });
  }
});

// Use our routes with the Express application
app.use("/users/api/v1", userRoutes);
app.use("/users/api/v1", platformRoutes);
app.use("/users/api/v1", taskRoutes);
app.use("/users/api/v1", eventRoutes);
app.use("/users/api/v1", summaryRoutes);
app.use("/users/api/v1", groupRoutes);

// Error handling middleware

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

module.exports = app;
