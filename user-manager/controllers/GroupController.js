const Group = require("../models/Group");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Platform = require("../models/Platform");

const GroupController = {
  getGroupsOfUser: async (req, res) => {
    try {
      if (req.headers.authorization == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const jwtUserId = decoded.userId;

      if (jwtUserId == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      const platforms = await Platform.findAll({
        where: { UserId: jwtUserId },
      });

      if (platforms.length === 0) {
        return res.status(404).json({ error: "You do not own any platform." });
      }

      let groupsOfUserByPlatform = [];

      for (const userPlatform of platforms) {
        const groups = await Group.find({
          platform: userPlatform.dataValues.platformName,
          user_id: userPlatform.dataValues.credentialId,
        });

        groupsOfUserByPlatform.push({
          platform: userPlatform.dataValues.platformName,
          groups,
        });
      }

      res.status(200).json({ platforms: groupsOfUserByPlatform });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteGroupOfUser: async (req, res) => {
    try {
      if (req.headers.authorization == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const jwtUserId = decoded.userId;

      if (jwtUserId == null) {
        return res.status(401).send({ error: "Unauthorized." });
      }

      const platforms = await Platform.findAll({
        where: { UserId: jwtUserId },
      });

      if (platforms.length === 0) {
        return res.status(404).json({ error: "You do not own any platform." });
      }

      const { groupId, platform } = req.body;

      // in platforms, find the corresponding platform and then the user id
      const userPlatform = platforms.find(
        (x) => x.dataValues.platformName === platform
      );

      const result = await Group.deleteOne({
        group_id: groupId,
        user_id: userPlatform.dataValues.credentialId,
        platform: platform,
      });

      if (result.deletedCount <= 0) {
        return res.status(404).json({ error: "Group not found." });
      }

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = GroupController;
