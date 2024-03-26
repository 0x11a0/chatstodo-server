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

      // Group records by the first tag
      const groupedByTags = {};

      summaries.forEach((summary) => {
        const tag = summary.tags[0];
        if (!groupedByTags[tag]) {
          groupedByTags[tag] = {
            summaries: [],
            tasks: [],
            events: [],
          };
        }
        groupedByTags[tag].summaries.push(summary);
      });
      tasks.forEach((task) => {
        const tag = task.tags[0];
        if (!groupedByTags[tag]) {
          groupedByTags[tag] = {
            summaries: [],
            tasks: [],
            events: [],
          };
        }
        groupedByTags[tag].tasks.push(task);
      });
      events.forEach((event) => {
        const tag = event.tags[0];
        if (!groupedByTags[tag]) {
          groupedByTags[tag] = {
            summaries: [],
            tasks: [],
            events: [],
          };
        }
        groupedByTags[tag].events.push(event);
      });

      console.log(groupedByTags);

      const telegramMessage = formatForTelegram(groupedByTags);

      console.log("Telegram", telegramMessage);
      res.status(200).json({
        message: telegramMessage,
      });
    } catch (error) {
      console.error("Error fetching summaries:", error);
      res.status(500).json({ error: "Error fetching summaries" });
    }
  },
};

function formatForTelegram(groupedByTags) {
  let message = "";

  if (groupedByTags === null || Object.keys(groupedByTags).length === 0) {
    return "No data found.";
  }

  Object.keys(groupedByTags).forEach((tag) => {
    message += `<b>${tag}</b>\n\n`;

    if (groupedByTags[tag].summaries.length > 0) {
      message += "Summary\n";
      groupedByTags[tag].summaries.forEach((summary, index) => {
        message += `${index + 1}. ${summary.value}\n`;
      });
      message += "\n";
    }

    if (groupedByTags[tag].events.length > 0) {
      message += "Events\n";
      groupedByTags[tag].events.forEach((event, index) => {
        message += `${index + 1}. ${event.value}\n- Location: ${
          event.location
        }\n- Time: ${new Date(event.dateStart).toLocaleDateString()}\n`;
      });
      message += "\n";
    }

    if (groupedByTags[tag].tasks.length > 0) {
      message += "Tasks\n";
      groupedByTags[tag].tasks.forEach((task, index) => {
        message += `${index + 1}. ${task.value}\n`;
      });
      message += "\n";
    }
  });

  return message;
}

module.exports = BotController;
