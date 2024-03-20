// EventController.js
const Event = require('../models/Event');

const EventController = {
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.findAll();
      res.json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Error fetching events' });
    }
  },

  getLatestEvents: async (req, res) => {
    try {
      const latestEvents = await Event.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5 // Assuming you want to get the latest 5 events
      });
      res.json(latestEvents);
    } catch (error) {
      console.error('Error fetching latest events:', error);
      res.status(500).json({ error: 'Error fetching latest events' });
    }
  },

  addEvent: async (req, res) => {
    try {
      const { value, location, dateStart, dateEnd, tags } = req.body;
      const newEvent = await Event.create({ value, location, dateStart, dateEnd, tags });
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error adding event:', error);
      res.status(500).json({ error: 'Error adding event' });
    }
  },

  removeEvent: async (req, res) => {
    try {
      const { eventId } = req.params;
      const event = await Event.findByPk(eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      await event.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error removing event:', error);
      res.status(500).json({ error: 'Error removing event' });
    }
  }
};

module.exports = EventController;
