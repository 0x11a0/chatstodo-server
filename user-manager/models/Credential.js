// Credential.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/db');
const Platform = require('./Platform');
const crypto = require('crypto');

const ENCRYPTION_ALGORITHM = 'aes-256-ctr';
const DB_SECRET = process.env.DB_SECRET;

const encrypt = (text) => {
  const cipher = crypto.createCipher(ENCRYPTION_ALGORITHM, DB_SECRET);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

const decrypt = (text) => {
  const decipher = crypto.createDecipher(ENCRYPTION_ALGORITHM, DB_SECRET);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const Credential = sequelize.define('Credential', {
  credentialId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  credentialSecret: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      // Decrypt the credential secret before retrieving it
      const encryptedSecret = this.getDataValue('credentialSecret');
      return decrypt(encryptedSecret);
    }
  }
}, {
  hooks: {
    beforeValidate: (credential) => {
      // Encrypt the credential secret before storing it
      credential.credentialSecret = encrypt(credential.credentialSecret);
    }
  }
});

Credential.belongsTo(Platform);
Platform.hasOne(Credential);

module.exports = Credential;
