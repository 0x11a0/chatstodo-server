// PlatformController.js
const Platform = require('../models/Platform');
const Credential = require('../models/Credential');
const { sequelize } = require('../services/db');



// Controller methods
const PlatformController = {
  // Add a new platform
  addPlatform: async (req, res) => {
    const { platformName, credentialId, credentialSecret } = req.body;

    try {
      // Start a database transaction
      const transaction = await sequelize.transaction();

      try {
        // Create the credential within the transaction
        const newCredential = await Credential.create({ credentialId, credentialSecret }, { transaction });

        // Create the platform using the generated credentialId within the transaction
        const newPlatform = await Platform.create({ platformName, credentialId: newCredential.id, UserId: req.userId}, { transaction });

        // Commit the transaction if everything is successful
        await transaction.commit();

        res.status(201).json(newPlatform);
      } catch (error) {
        // Rollback the transaction if any error occurs
        await transaction.rollback();
        console.error('Error adding platform:', error);
        res.status(500).json({ error: 'Error adding platform' });
      }
    } catch (error) {
      console.error('Error starting transaction:', error);
      res.status(500).json({ error: 'Error starting transaction' });
    }
  },

  removePlatform: async (req, res) => {
    const { platformId } = req.params;
    const userId = req.userId; // Retrieve the userId from req

    try {
        // Start a database transaction
        const transaction = await sequelize.transaction();

        try {
            // Find the platform within the transaction
            const platform = await Platform.findByPk(platformId, { transaction });
            if (!platform) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Platform not found' });
            }

            // Check if the requesting user owns the platform
            if (platform.userId !== userId) {
                await transaction.rollback();
                return res.status(403).json({ error: 'Unauthorized: You do not own this platform' });
            }

            // Find and remove the linked credential within the transaction
            await Credential.destroy({ where: { id: platform.credentialId } }, { transaction });

            // Remove the platform
            await platform.destroy({ transaction });

            // Commit the transaction if everything is successful
            await transaction.commit();

            res.status(204).end();
        } catch (error) {
            // Rollback the transaction if any error occurs
            await transaction.rollback();
            console.error('Error removing platform:', error);
            res.status(500).json({ error: 'Error removing platform' });
        }
    } catch (error) {
        console.error('Error starting transaction:', error);
        res.status(500).json({ error: 'Error starting transaction' });
    }
  },

  getPlatforms: async (req, res) => {
      const userId = req.userId; // Retrieve the userId from req

      try {
          // Find all platforms belonging to the requesting user and include their associated credential
          const platforms = await Platform.findAll({
              where: { userId }, // Filter by userId
              include: {
                  model: Credential,
                  as: 'Credential' // Alias for the associated credential
              }
          });

          res.json(platforms);
      } catch (error) {
          console.error('Error fetching platforms:', error);
          res.status(500).json({ error: 'Error fetching platforms' });
      }
  }
};

module.exports = PlatformController;
