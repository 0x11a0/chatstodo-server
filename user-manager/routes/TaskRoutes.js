const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');
const { isAuthenticated } = require('../middleware/auth');

// Define routes
router.get('/tasks', isAuthenticated, TaskController.getAllTasks);
router.post('/tasks', isAuthenticated, TaskController.addTask);
router.delete('/tasks/:taskId', isAuthenticated, TaskController.removeTask);

module.exports = router;
