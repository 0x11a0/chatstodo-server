// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const jwt = require("jsonwebtoken");
const User = require('../models/User');

console.log(process.env.JWT_SECRET);

exports.isAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "No authorization token provided." });
  }

  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // Return a 401 (Unauthorized) status with a relevant message
    return res.status(401).json({ message: "unauthorized" });
  }

  try {

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  
    let user = await User.findOne({ where: { _id: decodedData.userId } });

    if (!user) {
      user = await User.create({ _id: decodedData.userId });
    }
    req.userId = user._id;
    req.token = token;

    req.user = user;

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
