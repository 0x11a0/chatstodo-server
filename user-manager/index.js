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
const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

// Set up the connection to the MongoDB server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB successfully.');

    // Start the Express server
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
