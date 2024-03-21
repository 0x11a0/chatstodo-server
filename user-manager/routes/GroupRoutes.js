const express = require("express");
const router = express.Router();
const GroupController = require("../controllers/GroupController");
const { isAuthenticated } = require("../middleware/auth");

// Define routes
router.delete("/groups", isAuthenticated, GroupController.deleteGroupOfUser); 
router.get("/groups", isAuthenticated, GroupController.getGroupsOfUser);

module.exports = router;
