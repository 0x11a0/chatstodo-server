const mongoose = require("mongoose");

// Define the schema
const messageSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      required: true,
    },
    sender_name: {
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

messageSchema.statics.findByGroupIdAndPlatformAndTimestamp = async function (
  group_id,
  platform,
  start_timestamp
) {
  // find mathcing group id and platform, then find from start_timestamp
  return this.find({
    group_id,
    platform,
    timestamp: { $gte: start_timestamp },
  });
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
