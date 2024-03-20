// PlatformController.js
const Platform = require('../models/Platform');
const Credential = require('../models/Credential');
const { sequelize } = require('../services/db');



// Controller methods
const PlatformController = {
  addPlatform: async (req, res) => {
    const { platformName, credentialId, credentialSecret } = req.body;

    try {
      const userId = req.userId; // Retrieve the userId from req

      const transaction = await sequelize.transaction();

      try {
        const newCredential = await Credential.create({ credentialId, credentialSecret }, { transaction });

        const newPlatform = await Platform.create({ platformName, credentialId: newCredential.id, UserId: userId}, { transaction });

        await transaction.commit();

        res.status(201).json(newPlatform);
      } catch (error) {
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
        const transaction = await sequelize.transaction();

        try {
            const platform = await Platform.findByPk(platformId, { transaction });
            if (!platform) {
                await transaction.rollback();
                return res.status(404).json({ error: 'Platform not found' });
            }

            if (platform.userId !== userId) {
                await transaction.rollback();
                return res.status(403).json({ error: 'Unauthorized: You do not own this platform' });
            }

            await Credential.destroy({ where: { id: platform.credentialId } }, { transaction });

            await platform.destroy({ transaction });

            await transaction.commit();

            res.status(204).end();
        } catch (error) {
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
          const platforms = await Platform.findAll({
              where: { UserId: userId }, // Filter by userId
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
