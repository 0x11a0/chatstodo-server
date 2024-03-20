// SummaryController.js
const Summary = require('../models/Summary');

const SummaryController = {
  getAllSummary: async (req, res) => {
    try {
      const summaries = await Summary.findAll();
      res.json(summaries);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      res.status(500).json({ error: 'Error fetching summaries' });
    }
  },

  getLatestSummary: async (req, res) => {
    try {
      const latestSummary = await Summary.findOne({
        order: [['createdAt', 'DESC']]
      });
      res.json(latestSummary);
    } catch (error) {
      console.error('Error fetching latest summary:', error);
      res.status(500).json({ error: 'Error fetching latest summary' });
    }
  },

  addSummary: async (req, res) => {
    try {
      const { value, tags } = req.body;
      const newSummary = await Summary.create({ value, tags });
      res.status(201).json(newSummary);
    } catch (error) {
      console.error('Error adding summary:', error);
      res.status(500).json({ error: 'Error adding summary' });
    }
  },

  removeSummary: async (req, res) => {
    try {
      const { summaryId } = req.params;
      const summary = await Summary.findByPk(summaryId);
      if (!summary) {
        return res.status(404).json({ error: 'Summary not found' });
      }
      await summary.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error removing summary:', error);
      res.status(500).json({ error: 'Error removing summary' });
    }
  }
  
};

module.exports = SummaryController;
