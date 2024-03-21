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
const { syncDatabase } = require('./helper/dbSetup');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Start the Express server
const PORT = process.env.USER_MANAGER_PORT || 8081;
// Call the syncDatabase function to synchronize the database schema
syncDatabase()
  .then(() => {
    // Start your Express app once the database schema is synchronized
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to synchronize database schema:', error);
  });