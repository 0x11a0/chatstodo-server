const express = require('express');
const router = express.Router();
const CredentialController = require('../controllers/CredentialController');
const { isAuthenticated } = require('../middleware/auth');

// Define routes
router.post('/credentials', isAuthenticated, CredentialController.addCredential);
router.delete('/credentials/:credentialId', isAuthenticated, CredentialController.removeCredential);
router.get('/credentials', isAuthenticated, CredentialController.getCredentials);

module.exports = router;
