const express = require('express');
const router = express.Router();
const PlatformController = require('../controllers/PlatformController');
const { isAuthenticated } = require('../middleware/auth');

// Define routes
router.post('/platforms', isAuthenticated, PlatformController.addPlatform);
router.delete('/platforms/:platformId', isAuthenticated, PlatformController.removePlatform);
router.get('/platforms', isAuthenticated, PlatformController.getPlatforms);

module.exports = router;
