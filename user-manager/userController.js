/**
 * UserController.js
 * 
 * This file encapsulates the application logic for managing user data and interactions within the User Manager system. 
 * It serves as a bridge between the incoming HTTP requests and the underlying database operations, as well as external 
 * communications with ML Serverless Functions and other services. Key functionalities provided by this controller include:
 * 1. Registering a new user.
 * 2. Refreshing all user data by processing the latest chat messages through ML Serverless Functions.
 * 3. Retrieving comprehensive user data, including tasks, events, and summaries.
 * 4. Adding and removing platform links for user accounts.
 * 5. Fetching all platform links associated with a user.
 * 
 * Core aspects of this controller:
 * - Utilizes the User and Platform models for CRUD operations on the database, facilitating user and platform link management.
 * - Interacts with external ML Serverless Functions via gRPC for processing chat messages and updating user tasks and events.
 * - Implements error handling to manage and respond to issues during database operations or external service communication.
 * 
 */

// Import required modules, models, and gRPC client setup
// const User = require('./User');
const Platform = require('./models/Platform');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// Load protobuf definitions
const PROTO_PATH = path.join(__dirname, process.env.PROTO_PATH);
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const mlService = grpcObject.yourPackageName.YourServiceName; // Adjust these names based on your proto file

// Create a gRPC client instance
const client = new mlService('localhost:50051', grpc.credentials.createInsecure()); // Adjust the address and port as necessary

// (TO BE CREATED) Function to communicate with ML Serverless Functions via gRPC
const mlServerlessFunctions = require('./mlServerlessFunctions');

exports.register = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.refreshAll = async (req, res) => {
    try {
        const userId = req.params.userId;

        client.processLatestMessages({ userId }, (error, response) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }
            res.status(200).send({ message: 'Refresh all requested successfully.', data: response });
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getUserData = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Fetching logic, actual implementation depends on ML serverless DB structure and models
        const userData = {
            tasks: await Task.find({ userId }), // Assuming Task model exists after fetching
            events: await Event.find({ userId }), // Assuming Event model exists after fetching
            summaries: await Summary.find({ userId }) // Assuming Summary model exists after fetching
        };
        res.status(200).send(userData);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.addPlatformLink = async (req, res) => {
    try {
        const { userId, platform, credentials } = req.body;
        const platformLink = new Platform({ userId, platformName: platform, credentials });
        await platformLink.save();
        res.status(201).send({ message: 'Platform link added successfully.' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

exports.removePlatformLink = async (req, res) => {
    try {
        const { userId, platform } = req.body;
        await Platform.deleteOne({ userId, platformName: platform });
        res.status(200).send({ message: 'Platform link removed successfully.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

exports.getPlatformLink = async (req, res) => {
    try {
        const userId = req.params.userId;
        const platformLinks = await Platform.find({ userId });
        res.status(200).send(platformLinks);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

