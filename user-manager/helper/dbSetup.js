
const { sequelize } = require('../services/db'); // Assuming you've defined your Sequelize instance in a separate file
// Define a function to sync the database schema with Sequelize
async function syncDatabase() {
    try {
      // Synchronize the database schema with Sequelize
      await sequelize.sync({ alter: true }); // This will automatically create/update tables based on your models
      console.log('Database schema synchronized successfully.');
    } catch (error) {
      console.error('Error synchronizing database schema:', error);
    }
  }
  
  // Start the Express app after synchronizing the database schema
  module.exports = { syncDatabase };
