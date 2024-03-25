// UserController.js
const User = require("../models/User");
const Platform = require("../models/Platform");
const Message = require("../models/Message");
const Group = require("../models/Group");
const Summary = require("../models/Summary");
const Event = require("../models/Event");
const Task = require("../models/Task");
const { sendMessageData } = require("../services/mlService");

const UserController = {
  createUser: async (req, res) => {
    try {
      const { _id } = req.body;

      // Check if a user with the specified ID already exists
      const existingUser = await User.findOne({ where: { _id } });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User with specified ID already exists" });
      }

      // Create the user with the specified ID
      const newUser = await User.create({ _id });

      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  },

  /**
   * Refreshes the user's data by fetching messages from all platforms and groups
   * Then processing them with the ML functions to generate tasks, events and summaries
   * Finally updating the lastProcessed date for each platform
   */
  refresh: async (req, res) => {
    try {
      console.log("Running refresh");
      // req receive UserId
      const userId = req.userId; // Retrieve the userId from req
      const grpcClient = req.app.locals.grpcClient;
      console.log("Running grpc", grpcClient);

      // get all platforms user owns
      let platforms = await fetchPlatforms(userId);

      const platformsFromDB = platforms;
      platforms = platforms.map((p) => ({
        platformName: p.platformName,
        credentialId: p.credentialId,
        lastProcessed: p.lastProcessed,
      }));

      // loop through all platforms of user
      let allMessages = [];
      for (let { platformName, credentialId, lastProcessed } of platforms) {
        // get all groups the user is in for each platform
        const groups = await Group.find({
          user_id: credentialId,
        });

        // for each group, get the messages from mongodb (search by "group_id" and "platform") since
        // lastProcessed date (found in Platform model)
        for (let { group_id, group_name, platform } of groups) {
          let lastProcessedDate = new Date(lastProcessed);
          lastProcessedDate.setDate(lastProcessedDate.getDate() - 1); // Subtract one day
          let formattedLastProcessed = lastProcessedDate.toISOString();

          console.log(formattedLastProcessed);

          let message = await Message.findByGroupIdAndPlatformAndTimestamp(
            group_id,
            platform,
            formattedLastProcessed
          );

          console.log("Messages retrieved", message);

          message = message.map((m) => ({
            user_id: m.sender_name,
            chat_message: m.message,
            timestamp: m.timestamp,
          }));

          allMessages.push({
            group: group_name,
            platform: platformName,
            messages: message,
          });
        }
      }

      console.log("All messages", allMessages);

      // get Task, Event and Summary from ML Function
      for (let group of allMessages) {
        let results = await sendMessageData(grpcClient, userId, group.messages);
        const { summary, tasks, events } = results;

        // Add summaries
        for (let summaryText of summary) {
          await Summary.create({
            value: summaryText,
            UserId: userId,
            tags: [group.group, group.platform],
          });
        }

        // Add tasks
        for (let task of tasks) {
          // Check if deadline exists and is not null
          if (task.deadline) {
            await Task.create({
              value: taskText,
              deadline: new Date(deadline),
              UserId: userId,
              tags: [group.group, group.platform],
            });
          } else {
            await Task.create({
              value: task,
              UserId: userId,
              tags: [group.group, group.platform],
            });
          }
        }

        // Add events
        for (let event of events) {
          const dateParts = event.date.split("/");
          const formattedDate = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Converts DD/MM/YY to YYYY-MM-DD
          await Event.create({
            value: event.event,
            location: event.location,
            dateStart: new Date(formattedDate),
            dateEnd: new Date(formattedDate), // Assuming start and end on the same day, adjust as necessary
            UserId: userId,
            tags: [group.group, group.platform],
          });
        }

        // Update Last Processed Date
        const today = new Date().toISOString(); // Get today's date in ISO string format

        for (let platform of platformsFromDB) {
          await Platform.update(
            { lastProcessed: today },
            { where: { id: platform.id } }
          );
        }
      }

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error refreshing:", error);
      res.status(500).json({ error: "Error Refreshing" });
    }
  },
};

async function fetchPlatforms(userId) {
  return Platform.findAll({
    where: { UserId: userId },
  });
}

module.exports = UserController;
