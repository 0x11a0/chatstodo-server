/**
 * UserRoutes.js
 *
 * This file establishes the routing for user-related functionalities within the User Manager system of our Express application. It maps HTTP requests to specific controller functions dedicated to handling user data management and platform integrations. Each defined route includes:
 * 1. An HTTP method (GET, POST, DELETE) indicating the type of request it handles.
 * 2. A path or endpoint that clients will use to access the functionality.
 * 3. A reference to a controller function (from UserController.js) that executes in response to requests to the endpoint.
 *
 * Key functionalities covered include:
 * - User registration, allowing new users to create accounts without authentication.
 * - Refreshing user data by interacting with ML Serverless functions, requiring authentication.
 * - Adding, removing, and retrieving platform links associated with a user's account.
 *
 */

// Import required modules
const express = require("express");
const userController = require("./userController");
const { isAuthenticated } = require("./middleware/auth");

// Create a new router instance
const router = express.Router();

const userRouter = express.Router();

userRouter.get("/health", function (req, res) {
  res.status(200).send("Service is healthy");
});

// add a router group for /users/api/v1
userRouter.use(isAuthenticated);

// Route to trigger a refresh of all user data
// POST /users/api/v1/:userId/refreshAll
// router.post("/:userId/refreshAll", userController.refreshAll);

// Route to get user data
// GET /users/api/v1/:userId/data
// router.get("/:userId/data", userController.getUserData);

// Route to add a new platform link
// POST /users/api/v1/:userId/platforms
userRouter.post("/:userId/platforms", userController.addPlatformLink);

// Route to remove an existing platform link
// DELETE /users/api/v1/:userId/platforms
userRouter.delete("/:userId/platforms", userController.removePlatformLink);

// Route to get all platform links for a user
// GET /users/api/v1/:userId/platforms
userRouter.get("/:userId/platforms", userController.getPlatformLink);

router.use("/users/api/v1", userRouter);
// Export the router
module.exports = router;
