// UserController.js
const User = require("../models/User");
const Platform = require("../models/Platform");
const Message = require("../models/Message");
const Group = require("../models/Group");
const Summary = require("../models/Summary");
const Event = require("../models/Event");
const Task = require("../models/Task");
const { Timestamp } = require("google-protobuf/google/protobuf/timestamp_pb");

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

      // get all platforms user owns
      let platforms = await fetchPlatforms(userId);

      // loop through all platforms of user
      for (const platform of platforms) {
        // get all groups the user is in for each platform
        const groups = await Group.find({ user_id: platform.credentialId });
        for (const group of groups) {
          const messages = await Message.findByGroupIdAndPlatformAndTimestamp(
            group.group_id,
            platform.platformName,
            platform.lastProcessed
          );

          const chatMessages = prepareChatMessages(messages);
          const chatAnalysisRequest = createChatAnalysisRequest(
            userId,
            chatMessages
          );
          const chatAnalysisResponse = await sendChatAnalysisRequest(
            grpcClient,
            chatAnalysisRequest
          );

          await processChatAnalysisResponse(
            chatAnalysisResponse,
            group.group_name,
            platform.platformName,
            userId
          );
        }
        await updateLastProcessed(platform.id);
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

function prepareChatMessages(messages) {
  const currentTimestamp = new Timestamp();
  currentTimestamp.fromDate(new Date());

  return messages.map((m) => ({
    user_id: m.sender_name,
    chat_message: m.message,
    timestamp: currentTimestamp,
  }));
}

function createChatAnalysisRequest(userId, chatMessages) {
  const currentTimestamp = new Timestamp();
  currentTimestamp.fromDate(new Date());

  return {
    user_id: userId,
    timestamp: currentTimestamp,
    message_text: chatMessages,
  };
}

function sendChatAnalysisRequest(grpcClient, chatAnalysisRequest) {
  return new Promise((resolve, reject) => {
    grpcClient.analyzeChat(chatAnalysisRequest, (error, response) => {
      if (error) {
        console.error("Error sending chat analysis request:", error);
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

async function processChatAnalysisResponse(
  response,
  groupName,
  platformName,
  userId
) {
  const { summary, tasks, events } = response;

  // Add summaries
  for (let summaryText of summary) {
    await Summary.create({
      value: summaryText,
      UserId: userId,
      tags: [groupName, platformName],
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
        tags: [groupName, platformName],
      });
    } else {
      await Task.create({
        value: task,
        UserId: userId,
        tags: [groupName, platformName],
      });
    }
  }

  // Add events
  for (let event of events) {
    // const dateParts = event.date.split("/");
    // const formattedDate = `20${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Converts DD/MM/YY to YYYY-MM-DD
    await Event.create({
      value: event.event,
      location: event.location,
      dateStart: new Date(event.date),
      dateEnd: new Date(event.date), // Assuming start and end on the same day, adjust as necessary
      UserId: userId,
      tags: [groupName, platformName],
    });
  }
}

async function updateLastProcessed(platformId) {
  await Platform.update(
    { lastProcessed: new Date() },
    { where: { id: platformId } }
  );
}

module.exports = UserController;
