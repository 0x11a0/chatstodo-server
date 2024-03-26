// SummaryController.js
const Summary = require("../models/Summary");
const Task = require("../models/Task");
const Event = require("../models/Event");
const Group = require("../models/Group");
const Platform = require("../models/Platform");
const Message = require("../models/Message");

const { Timestamp } = require("google-protobuf/google/protobuf/timestamp_pb");
const protoMessages = require("../generated/chatstodo_ml_service_pb");

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
  /**
   * Refreshes the user's data by fetching messages from all platforms and groups
   * Then processing them with the ML functions to generate tasks, events and summaries
   * Finally updating the lastProcessed date for each platform
   */
  // TODO: FIX THIS BUG
  refresh: async (req, res) => {
    try {
      console.log("Running refresh");
      // req receive UserId
      const userId = req.userId; // Retrieve the userId from req
      const grpcClient = req.app.locals.grpcClient;
      let hasUpdates = false;

      const platform = await Platform.findOne({
        where: { UserId: userId, platformName: "Telegram" },
      });

      // get all groups the user is in for this platform
      const groups = await Group.find({ user_id: platform.credentialId });
      for (const group of groups) {
        const messages = await Message.findByGroupIdAndPlatformAndTimestamp(
          group.group_id,
          platform.platformName,
          platform.lastProcessed
        );
        console.log(messages);

        const chatMessages = prepareChatMessages(messages);
        const request = createChatAnalysisRequest(
          platform.credentialName,
          chatMessages
        );
        const response = await sendChatAnalysisRequest(grpcClient, request);

        const haveUpdatesFromRequest = await processChatAnalysisResponse(
          response,
          group.group_name,
          platform.platformName,
          userId
        );

        if (haveUpdatesFromRequest) {
          hasUpdates = true;
        }
      }
      await updateLastProcessed(platform.id);

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

module.exports = BotController;
