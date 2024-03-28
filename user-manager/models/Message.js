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
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    collection: "Messages",
  }
);

messageSchema.statics.findByGroupIdAndPlatformAndTimestamp = async function (
  group_id,
  platform,
  lastProcessed
) {
  if (lastProcessed === null) {
    return this.find({
      group_id,
      platform,
    }).sort({ timestamp: 1 });
  }
  
  const converted = new Date(lastProcessed);

  return this.find({
    group_id,
    platform,
    timestamp: { $gt: converted },
  }).sort({ timestamp: 1 });
};

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
