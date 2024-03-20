// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require("jsonwebtoken");
const User = require('../models/User');

console.log(process.env.JWT_SECRET);

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "No authorization token provided." });
  }

  // Get the 'authorization' header from the incoming request
  const authHeader = req.headers.authorization;

  // Check if the authorization header exists. If it does, split it at the space
  // (typically it looks like "Bearer <TOKEN>"). Extract the token part.
  const token = authHeader && authHeader.split(" ")[1];

  // If there's no token, it means the request doesn't have proper authentication details
  if (!token) {
    // Return a 401 (Unauthorized) status with a relevant message
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    // If there's a token, attempt to verify it using the JWT secret from environment variables
    // If the verification is successful, decodedData will have the payload of the JWT.
    // If it's not successful (e.g., if the token has been tampered with),
    // it will throw an error, which you'd ideally catch in a production setup.
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
    // Check if the user with the decoded ID exists in the database
    let user = await User.findOne({ where: { _id: decodedData.userId } });

    // If the user doesn't exist, add a record for the user in the database
    if (!user) {
      // Create a new user record with the decoded user ID
      user = await User.create({ _id: decodedData.userId });
    }
    req.userId = user._id;
    // Attach the token to the request object for subsequent middleware/controllers
    req.token = token;

    // Attach the user object to the request object as 'user'
    req.user = user;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
