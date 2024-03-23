require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Generates a JWT for a given userId.
 * 
 * @param {string} userId - The user ID to be included in the JWT payload.
 * @returns {string} The generated JWT.
 */
function generateJwt(userId) {
    // Define the payload
    const payload = {
        userId
    };

    // Define the secret key
    const secretKey = process.env.JWT_SECRET_KEY;

    // Define token options, such as expiry
    const options = {
        expiresIn: '1h' // Token expires in 1 hour
    };

    // Generate the JWT
    const token = jwt.sign(payload, secretKey, options);

    return token;
}

const token = generateJwt("253066600");
console.log(token);
