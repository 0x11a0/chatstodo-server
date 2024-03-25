const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Platform = require("../models/Platform");
require("dotenv").config();

exports.isAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "No authorization token provided." });
  }

  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let user = await User.findOne({ where: { _id: decodedData.userId } });

    if (!user) {
      user = await User.create({ _id: decodedData.userId });
    }
    req.userId = user._id;
    req.token = token;

    req.user = user;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

exports.isPlatformAuthenticated = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "No authorization token provided." });
  }

  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("decoded", decodedData);

    let platform = await Platform.findOne({
      where: {
        platformName: decodedData.platformName,
        credentialId: decodedData.credentialId,
      },
    });

    if (!platform) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.platformName = platform.platformName;
    req.credentialId = platform.credentialId;
    req.userId = platform.UserId;
    req.token = token;

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
