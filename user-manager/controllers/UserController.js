// UserController.js
const User = require('../models/User');

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
  }
};

module.exports = UserController;
