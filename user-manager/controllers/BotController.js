// SummaryController.js
const Summary = require("../models/Summary");
const Task = require("../models/Task");
const Event = require("../models/Event");
const { Op } = require("sequelize");

const BotController = {
  aggregateForPlatform: async (req, res) => {
    const userId = req.userId; // Retrieve the userId from req
    const platformName = req.platformName;
    const credentialId = req.credentialId;

    try {
      console.log("Fetching summaries for user:", userId, "on", platformName);
      // Find all summaries belonging to the requesting user
      const summaries = await Summary.findAll({
        where: { UserId: userId, tags: { [Op.contains]: [platformName] } },
      });

      const tasks = await Task.findAll({
        where: { UserId: userId, tags: { [Op.contains]: [platformName] } },
      });

      const events = await Event.findAll({
        where: { UserId: userId, tags: { [Op.contains]: [platformName] } },
      });

      console.log(summaries);

      res.status(200).json({
        summary: summaries,
        tasks: tasks,
        events: events,
      });
    } catch (error) {
      console.error("Error fetching summaries:", error);
      res.status(500).json({ error: "Error fetching summaries" });
    }
  },
};

module.exports = BotController;
