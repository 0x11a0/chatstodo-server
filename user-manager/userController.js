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
const Platform = require("./models/Platform");
const redisClient = require("./redisClient");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

// Load protobuf definitions
// const PROTO_PATH = path.join(__dirname, process.env.PROTO_PATH);
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
// const grpcObject = grpc.loadPackageDefinition(packageDefinition);
// const mlService = grpcObject.yourPackageName.YourServiceName; // Adjust these names based on your proto file

// // Create a gRPC client instance
// const client = new mlService(
//   "localhost:50051",
//   grpc.credentials.createInsecure()
// ); // Adjust the address and port as necessary

// (TO BE CREATED) Function to communicate with ML Serverless Functions via gRPC
// const mlServerlessFunctions = require("./mlServerlessFunctions");

exports.getSummary = async (req, res) => {
  try {
    const userId = req.params.userId;

    // client.processLatestMessages({ userId }, (error, response) => {
    //   if (error) {
    //     return res.status(500).send({ error: error.message });
    //   }
    //   res.status(200).send({
    //     message: "Refresh all requested successfully.",
    //     data: response,
    //   });
    // });
    res.status(200).send({
      message: "Refresh all requested successfully.",
      data: [],
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// TODO: Insert the data into the database
exports.addPlatformLink = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Assuming the token is sent as "Bearer <token>"
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const jwtUserId = decoded.userId;

    if (jwtUserId == null) {
      return res.status(401).send({ error: "Unauthorized." });
    }

    const { userId, platform, verificationCode } = req.body;

    const verificationKey = `user_verification:${userId}`;
    const storedVerificationCode = await redisClient.get(verificationKey);

    if (!storedVerificationCode) {
      return res
        .status(404)
        .send({ error: "Verification details not found for user." });
    }

    if (storedVerificationCode !== verificationCode) {
      return res.status(400).send({ error: "Incorrect verification code." });
    }

    // const platformLink = new Platform({
    //   jwtUserId,
    //   platformName: platform,
    //   credentials: {
    //     userId: userId,
    //   },
    // });

    // await platformLink.save();

    await redisClient.del(verificationKey);

    res.status(201).send({ message: "Platform link added successfully." });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.removePlatformLink = async (req, res) => {
  try {
    const { userId, platform } = req.body;
    await Platform.deleteOne({ userId, platformName: platform });
    res.status(200).send({ message: "Platform link removed successfully." });
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
