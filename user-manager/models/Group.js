const mongoose = require("mongoose");

// Define the schema
const groupSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    group_id: {
      type: String,
      required: true,
    },
    group_name: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  {
    collection: "Groups",
  }
);

const Group = mongoose.model("Group", groupSchema);

module.exports = Group;
