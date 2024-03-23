const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { isAuthenticated } = require('../middleware/auth');

// Define routes
router.get('/refresh', isAuthenticated, UserController.refresh);

module.exports = router;
