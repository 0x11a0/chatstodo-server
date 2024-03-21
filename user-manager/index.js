/**
 * index.js
 *
 * This is the entry point of our Express application. It handles:
 * 1. Database connection setup using the Mongoose library and Sequelize for PostgreSQL.
 * 2. Starting the Express server once both databases are successfully connected.
 * 3. Environment variables configuration using the `dotenv` library.
 */

// Import required modules
const app = require("./app"); // Ensure this path is correct
const { connectToMongoDB, connectToPostgreSQL } = require("./helper/dbSetup"); // Adjust the path as necessary
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Start the Express server
const PORT = process.env.USER_MANAGER_PORT || 8081;

// Define an asynchronous function to connect to databases and start the server
async function startApp() {
  try {
    await connectToMongoDB(); // Connect to MongoDB
    await connectToPostgreSQL(); // Sync PostgreSQL schema
    console.log("All databases are connected successfully.");

    // Start your Express app once the database connections are established
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start the application due to a database connection error:",
      error
    );
  }
}

// Call the startApp function to initiate the database connections and start the Express server
startApp();
