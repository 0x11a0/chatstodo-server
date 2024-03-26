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

router.get("/bot/refresh", isPlatformAuthenticated, BotController.refresh);

module.exports = router;
