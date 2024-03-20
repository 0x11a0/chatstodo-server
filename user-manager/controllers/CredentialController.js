// CredentialController.js
const Credential = require('../models/Credential');

const CredentialController = {
  addCredential: async (req, res) => {
    try {
      const { credentialId, credentialSecret } = req.body;
      const newCredential = await Credential.create({ credentialId, credentialSecret });
      res.status(201).json(newCredential);
    } catch (error) {
      console.error('Error adding credential:', error);
      res.status(500).json({ error: 'Error adding credential' });
    }
  },

  removeCredential: async (req, res) => {
    try {
      const { credentialId } = req.params;
      const credential = await Credential.findByPk(credentialId);
      if (!credential) {
        return res.status(404).json({ error: 'Credential not found' });
      }
      await credential.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error removing credential:', error);
      res.status(500).json({ error: 'Error removing credential' });
    }
  },

  getCredentials: async (req, res) => {
    try {
      const credentials = await Credential.findAll();
      res.json(credentials);
    } catch (error) {
      console.error('Error fetching credentials:', error);
      res.status(500).json({ error: 'Error fetching credentials' });
    }
  }
};

module.exports = CredentialController;
