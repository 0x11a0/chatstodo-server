/**
 * index.js
 *
 * This is the entry point of our Express application. It handles:
 * 1. Database connection setup using the Mongoose library.
 * 2. Starting the Express server once the database is successfully connected.
 * 3. Environment variables configuration using the `dotenv` library.
 *
 */

// Import required modules

const app = require("./app");
require("dotenv").config();

// Start the Express server
const PORT = process.env.USER_MANAGER_PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
