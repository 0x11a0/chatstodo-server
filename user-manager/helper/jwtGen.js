const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Sample JSON data to encrypt
const jsonData = {
  userId: '123456'
};

// Secret key for JWT encryption
const secretKey = process.env.JWT_SECRET;

// Expiration time for JWT token (in seconds)
const expiresIn = process.env.JWT_EXPIRY; // You may need to convert this to a number if it's a string

// Generate JWT token
const token = jwt.sign(jsonData, secretKey, { expiresIn });

console.log('JWT token:', token);
