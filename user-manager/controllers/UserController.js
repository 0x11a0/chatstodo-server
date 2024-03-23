// UserController.js
const User = require('../models/User');
const Platform = require('../models/Platform');
const Message = require('../models/Message');
const Group = require('../models/Group');

const UserController = {
  createUser: async (req, res) => {
    try {
      const { _id } = req.body;

      // Check if a user with the specified ID already exists
      const existingUser = await User.findOne({ where: { _id } });
      if (existingUser) {
        return res.status(400).json({ error: 'User with specified ID already exists' });
      }

      // Create the user with the specified ID
      const newUser = await User.create({ _id });

      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  },

  refresh: async (req, res) => {
    try{
      // req receive UserId
      const userId = req.userId; // Retrieve the userId from req

      // get all platforms user owns
      let platforms = await Platform.findAll({
          where: { UserId: userId }
      });
      platforms = platforms.map(p => ({platformName: p.platformName, credentialId: p.credentialId, lastProcessed: p.lastProcessed}));

      // loop through all platforms of user
      let allMessages = [];
      for (let {platformName, credentialId, lastProcessed} of platforms) {
        // get all groups the user is in for each platform
        const groups = await Group.find({
          user_id: credentialId
        });

        // for each group, get the messages from mongodb (search by "group_id" and "platform") since lastProcessed date (found in Platform model)
    
        for (let {group_id, platform} of groups) {
          let lastProcessedDate = new Date(lastProcessed);
          lastProcessedDate.setDate(lastProcessedDate.getDate() - 1); // Subtract one day
          let formattedLastProcessed = lastProcessedDate.toISOString();

          let message = await Message.findByGroupIdAndPlatformAndTimestamp(group_id, platform, formattedLastProcessed)
          message = message.map(m => ({"user_id": m.sender_name, chat_message: m.message, timestamp: m.timestamp}));

          allMessages.push({ group: group_id, messages: message});
        }
      }

      
      res.status(200).json(allMessages);

    } catch (error) {
      console.error('Error refreshing:', error);
      res.status(500).json({ error: 'Error Refreshing'});
    }
  }
};

module.exports = UserController;
