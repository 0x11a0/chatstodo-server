// PlatformController.js
const Platform = require("../models/Platform");
const { sequelize } = require("../services/postgresql");

const redisClient = require("../redisClient");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Controller methods
const PlatformController = {
  addPlatform: async (req, res) => {
    try {
      if (req.headers.authorization == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      // perform the otp exchange here
      const token = req.headers.authorization.split(" ")[1]; // Assuming the token is sent as "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const jwtUserId = decoded.userId;

      if (jwtUserId == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      const { verificationCode } = req.body;

      const storedDetails = await redisClient.get(verificationCode);

      if (!storedDetails) {
        return res.status(404).send({
          error:
            "Invalid verification code or may have expired. Please request again.",
        });
      }

      const [keyType, userId, userName, platform] = storedDetails.split(":");

      if (
        keyType !== "user_verification" ||
        userId == null ||
        platform == null
      ) {
        return res.status(500).send({ error: "Bad Request" });
      }

      const transaction = await sequelize.transaction();

      // Check if the platform is already linked to the user
      const existingPlatform = await Platform.findOne({
        where: {
          platformName: platform,
          UserId: jwtUserId,
        },
      });

      if (existingPlatform) {
        await transaction.rollback();
        return res
          .status(409)
          .json({ error: "Platform already linked to the user." });
      }

      try {
        const newPlatform = await Platform.create(
          {
            platformName: platform,
            credentialId: userId,
            credentialName: userName,
            UserId: jwtUserId,
          },
          { transaction }
        );

        await transaction.commit();

        await redisClient.del(verificationCode);

        res.status(201).json({ message: "Platform link added successfully." });
      } catch (error) {
        await transaction.rollback();
        console.error("Error adding platform:", error);
        res.status(500).json({ error: "Error adding platform" });
      }
    } catch (error) {
      console.error("Error starting transaction:", error);
      res.status(500).json({ error: "Error starting transaction" });
    }
  },

  removePlatform: async (req, res) => {
    try {
      if (req.headers.authorization == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      const token = req.headers.authorization.split(" ")[1]; // Assuming the token is sent as "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const jwtUserId = decoded.userId;

      if (jwtUserId == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      const { platformId } = req.body;

      const transaction = await sequelize.transaction();

      try {
        const platform = await Platform.findByPk(platformId, { transaction });
        if (!platform) {
          await transaction.rollback();
          return res.status(404).json({ error: "Platform not found" });
        }
        console.log(platform.UserId, jwtUserId);
        if (platform.UserId !== jwtUserId) {
          await transaction.rollback();
          return res
            .status(403)
            .json({ error: "You do not own this platform" });
        }

        await platform.destroy({ transaction });

        await transaction.commit();

        res.status(204).end();
      } catch (error) {
        await transaction.rollback();
        console.error("Error removing platform:", error);
        res.status(500).json({ error: "Error removing platform" });
      }
    } catch (error) {
      console.error("Error starting transaction:", error);
      res.status(500).json({ error: "Error starting transaction" });
    }
  },

  getPlatforms: async (req, res) => {
    try {
      if (req.headers.authorization == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      // perform the otp exchange here
      const token = req.headers.authorization.split(" ")[1]; // Assuming the token is sent as "Bearer <token>"
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const jwtUserId = decoded.userId;

      if (jwtUserId == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      const platforms = await Platform.findAll({
        where: { UserId: jwtUserId }, // Filter by userId
      });

      res.status(200).json({ platforms: platforms });
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ error: "Error fetching platforms." });
    }
  },
};

module.exports = PlatformController;
