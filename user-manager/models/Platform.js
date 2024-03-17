// Platform.js
/**
 * This file defines the structure and behavior of the 'Platform' data model in our application.
 * It uses the Mongoose library to define a schema for platform links associated with users.
 * These platform links include details such as the user's ID (pending confirmation), the platform name, and credentials
 * required for accessing or integrating with the platform.
 * 
 * The model supports operations like adding a new platform link for a user, removing an existing
 * platform link, and retrieving all platform links associated with a user.
 * 
 * The timestamps option in the schema automatically manages createdAt and updatedAt fields,
 * providing a historical record of when each platform link was created or last updated.
 */

// Import required modules
const mongoose = require('mongoose');

// Define the Platform schema for Mongoose
const platformSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true, // Reference to the User model
    //     ref: 'User'
    // },
    platformName: {
        type: String,
        required: true,  // The name of the platform (e.g., 'Telegram', 'Slack')
    },
    credentials: {
        type: Map,
        of: String,
        required: true  // Store platform-specific credentials as key-value pairs
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt timestamps
});

// Create a Mongoose model based on the schema
const Platform = mongoose.model('Platform', platformSchema);

// Export the model
module.exports = Platform;
