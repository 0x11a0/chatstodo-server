// EventController.js
const Event = require("../models/Event");

const EventController = {
  getAllEvents: async (req, res) => {
    const userId = req.userId; // Retrieve the userId from req

    try {
      const events = await Event.findAll({ where: { UserId: userId } });
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Error fetching events" });
    }
  },

  addEvent: async (req, res) => {
    try {
      const userId = req.userId; // Retrieve the userId from req
      const { value, location, dateStart, dateEnd, tags } = req.body;
      const newEvent = await Event.create({
        value,
        location,
        dateStart,
        dateEnd,
        tags,
        UserId: userId,
      });
      res.status(201).json(newEvent);
    } catch (error) {
      console.error("Error adding event:", error);
      res.status(500).json({ error: "Error adding event" });
    }
  },

  removeEvent: async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.userId; // Retrieve the userId from req

      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (event.dataValues.UserId !== userId) {
        return res
          .status(403)
          .json({ error: "Unauthorized: You do not own this summary" });
      }

      await event.destroy();

      res.status(204).end();
    } catch (error) {
      console.error("Error removing event:", error);
      res.status(500).json({ error: "Error removing event" });
    }
  },
};

module.exports = EventController;
