const express = require("express");
const router = express.Router();
const BotController = require("../controllers/BotController");
const { isPlatformAuthenticated } = require("../middleware/auth");

// Define routes
router.get(
  "/bot/all",
  isPlatformAuthenticated,
  BotController.aggregateForPlatform
);

module.exports = router;
