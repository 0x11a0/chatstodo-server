// TaskController.js
const Task = require('../models/Task');

const TaskController = {
  getAllTasks: async (req, res) => {
    const userId = req.userId; // Retrieve the userId from req

    try {
        const tasks = await Task.findAll({
            where: { UserId: userId }, // Filter by userId
        });
        
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
    }
  },

  addTask: async (req, res) => {
    try {
      const userId = req.userId; // Retrieve the userId from req
      const { value, deadline, tags } = req.body;
      const newTask = await Task.create({ value, deadline, tags, UserId: userId });
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ error: 'Error adding task' });
    }
  },

  removeTask: async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.userId; // Retrieve the userId from req

        // Find the task by its id and user id
        const task = await Task.findOne({ where: { id: taskId, UserId: userId } });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Remove the task if it belongs to the user
        await task.destroy();

        res.status(204).end();
    } catch (error) {
        console.error('Error removing task:', error);
        res.status(500).json({ error: 'Error removing task' });
    }
  }
};

module.exports = TaskController;
