const express = require('express');
const router = express.Router();
const SummaryController = require('../controllers/SummaryController');
const { isAuthenticated } = require('../middleware/auth');

// Define routes
router.get('/summaries', isAuthenticated, SummaryController.getAllSummary);
router.post('/summaries', isAuthenticated, SummaryController.addSummary);
router.delete('/summaries/:summaryId', isAuthenticated, SummaryController.removeSummary);

module.exports = router;
