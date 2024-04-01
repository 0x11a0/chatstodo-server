// SummaryController.js
const Summary = require('../models/Summary');

const SummaryController = {
  getAllSummary: async (req, res) => {
    const userId = req.userId; // Retrieve the userId from req

    try {
        // Find all summaries belonging to the requesting user
        const summaries = await Summary.findAll({ where: { UserId: userId } });
        res.json(summaries);
    } catch (error) {
        console.error('Error fetching summaries:', error);
        res.status(500).json({ error: 'Error fetching summaries' });
    }
  },

  addSummary: async (req, res) => {
    try {
      const userId = req.userId; // Retrieve the userId from req
      const { value, tags } = req.body;
      const newSummary = await Summary.create({ value, tags, UserId: userId});
      res.status(201).json(newSummary);
    } catch (error) {
      console.error('Error adding summary:', error);
      res.status(500).json({ error: 'Error adding summary' });
    }
  },

  removeSummary: async (req, res) => {
    try {
        const { summaryId } = req.params;
        const userId = req.userId; // Retrieve the userId from req

        // Find the summary by its id
        const summary = await Summary.findByPk(summaryId);

        if (!summary) {
            return res.status(404).json({ error: 'Summary not found' });
        }

        // Check if the summary belongs to the user
        if (summary.dataValues.UserId !== userId) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this summary' });
        }

        // Remove the summary if it belongs to the user
        await summary.destroy();

        res.status(204).end();
    } catch (error) {
        console.error('Error removing summary:', error);
        res.status(500).json({ error: 'Error removing summary' });
    }
  }
  
};

module.exports = SummaryController;
