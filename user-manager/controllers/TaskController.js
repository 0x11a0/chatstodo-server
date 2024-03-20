// TaskController.js
const Task = require('../models/Task');

const TaskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.findAll();
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Error fetching tasks' });
    }
  },

  getLatestTasks: async (req, res) => {
    try {
      const latestTasks = await Task.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5 // Assuming you want to get the latest 5 tasks
      });
      res.json(latestTasks);
    } catch (error) {
      console.error('Error fetching latest tasks:', error);
      res.status(500).json({ error: 'Error fetching latest tasks' });
    }
  },

  addTask: async (req, res) => {
    try {
      const { value, deadline, tags } = req.body;
      const newTask = await Task.create({ value, deadline, tags });
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ error: 'Error adding task' });
    }
  },

  removeTask: async (req, res) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findByPk(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      await task.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error removing task:', error);
      res.status(500).json({ error: 'Error removing task' });
    }
  }
};

module.exports = TaskController;
