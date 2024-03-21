const mongoose = require("mongoose");

// Define the schema
const messageSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
    },
    sender_user_id: {
      type: String,
      required: true,
    },
    group_id: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
  },
  {
    collection: "Messages",
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
