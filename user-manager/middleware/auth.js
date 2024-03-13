/**
 * auth.js (middleware)
 * 
 * This middleware ensures that certain routes of our application are protected and can only be accessed by authenticated users.
 * When a request is made to a protected route:
 * 1. This middleware checks for the presence of a token in the request headers.
 * 2. If a token is found, it is verified using a secret key.
 * 3. If the token is valid, the request is allowed to proceed; otherwise, an error is thrown.
 * 
 * Key components include:
 * - Token extraction from the 'Authorization' header.
 * - Token verification using the JSON Web Token (JWT) library.
 * - Addition of the user's decoded data to the request object for subsequent middleware or controllers.
 * 
 * This acts as a gatekeeper, ensuring that only authenticated requests can interact with protected endpoints.
 */


// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    
    // Get the 'authorization' header from the incoming request
    const authHeader = req.headers.authorization;

    // Check if the authorization header exists. If it does, split it at the space 
    // (typically it looks like "Bearer <TOKEN>"). Extract the token part.
    const token = authHeader && authHeader.split(' ')[1];
    
    // If there's no token, it means the request doesn't have proper authentication details
    if (!token) {
        // Return a 401 (Unauthorized) status with a relevant message
        return res.status(401).json({message: "unauthorized"});
    }

    // If there's a token, attempt to verify it using the JWT secret from environment variables
    // If the verification is successful, decodedData will have the payload of the JWT.
    // If it's not successful (e.g., if the token has been tampered with), 
    // it will throw an error, which you'd ideally catch in a production setup.
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Assign the decoded data to the request object as 'user'. 
    // This means in future middleware or route handlers, you can access the authenticated user's details via req.user.
    // req.user = await User.findById(decodedData._id);

    // Attach the token to the request object for subsequent middleware/controllers
    req.token = token;

    // Move to the next middleware or route handler
    next();
};
