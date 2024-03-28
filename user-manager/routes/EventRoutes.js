const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');
const { isAuthenticated } = require('../middleware/auth');

// Define routes
router.get('/events', isAuthenticated, EventController.getAllEvents);
router.post('/events', isAuthenticated, EventController.addEvent);
router.delete('/events/:eventId', isAuthenticated, EventController.removeEvent);

module.exports = router;
