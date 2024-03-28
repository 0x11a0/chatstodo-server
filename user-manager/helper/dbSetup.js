const { sequelize } = require("../services/postgresql");
const { connectToMongoDB } = require("../services/mongodb");
require("dotenv").config();

async function connectToPostgreSQL() {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database schema synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database schema:", error);
  }
}

module.exports = { connectToMongoDB, connectToPostgreSQL };
