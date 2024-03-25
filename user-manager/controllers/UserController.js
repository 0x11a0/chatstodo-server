// UserController.js
const User = require("../models/User");
const Platform = require("../models/Platform");
const Message = require("../models/Message");
const Group = require("../models/Group");
const Summary = require("../models/Summary");
const Event = require("../models/Event");
const Task = require("../models/Task");
const { Timestamp } = require("google-protobuf/google/protobuf/timestamp_pb");
const protoMessages = require("../generated/chatstodo_ml_service_pb");

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
      let hasUpdates = true;

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
          const request = createChatAnalysisRequest(userId, chatMessages);
          const response = await sendChatAnalysisRequest(grpcClient, request);

          const haveUpdatesFromRequest = await processChatAnalysisResponse(
            response,
            group.group_name,
            platform.platformName,
            userId
          );

          if (!haveUpdatesFromRequest) {
            hasUpdates = false;
          }
        }
        await updateLastProcessed(platform.id);
      }

      if (!hasUpdates) {
        return res
          .status(200)
          .json({ success: true, message: "No updates were necessary." });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "Updates were processed." });
      }
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
  return messages.map((m) => {
    const chatMessage = new protoMessages.Chat();
    chatMessage.setUserId(m.sender_name);
    chatMessage.setChatMessage(m.message);

    const requestTimestamp = new Timestamp();
    const now = new Date();
    requestTimestamp.setSeconds(Math.floor(now.getTime() / 1000));
    requestTimestamp.setNanos((now.getTime() % 1000) * 1000000);
    chatMessage.setTimestamp(requestTimestamp);

    return chatMessage;
  });
}

function createChatAnalysisRequest(userId, chatMessages) {
  const request = new protoMessages.UserChatRequest();
  request.setUserId(userId);

  const requestTimestamp = new Timestamp();
  const now = new Date();
  requestTimestamp.setSeconds(Math.floor(now.getTime() / 1000));
  requestTimestamp.setNanos((now.getTime() % 1000) * 1000000);
  request.setTimestamp(requestTimestamp);

  chatMessages.forEach((msg) => request.addMessageText(msg));
  return request;
}

async function sendChatAnalysisRequest(grpcClient, chatAnalysisRequest) {
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
  const responseObject = response.toObject ? response.toObject() : response;
  console.log("Response", responseObject);

  // Now proceed with your checks and processing using responseObject
  if (
    !responseObject.summaryList.length &&
    !responseObject.tasksList.length &&
    !responseObject.eventsList.length
  ) {
    console.log("Empty response from gRPC");
    return false;
  }

  const summary = Array.isArray(responseObject.summaryList)
    ? responseObject.summaryList
    : [];
  console.log("Summary", summary);

  // Add summaries
  for (let summaryText of summary) {
    await Summary.create({
      value: summaryText,
      UserId: userId,
      tags: [groupName, platformName],
    });
  }

  const tasks = Array.isArray(responseObject.tasksList)
    ? responseObject.tasksList
    : [];
  // Add tasks
  for (let task of tasks) {
    // Check if deadline exists and is not null
    await Task.create({
      value: task,
      UserId: userId,
      tags: [groupName, platformName],
    });
  }

  const events = Array.isArray(responseObject.eventsList)
    ? responseObject.eventsList
    : [];
  // Add events
  for (let event of events) {
    try {
      await Event.create({
        value: event.event,
        location: event.location,
        dateStart: new Date(event.date),
        dateEnd: new Date(event.date),
        UserId: userId,
        tags: [groupName, platformName],
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  }
  return true;
}

async function updateLastProcessed(platformId) {
  await Platform.update(
    { lastProcessed: new Date() },
    { where: { id: platformId } }
  );
}

module.exports = UserController;
