// Platform.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/postgresql");
const User = require("./User");

const Platform = sequelize.define("Platform", {
  platformName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  credentialId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastProcessed: {
    type: DataTypes.DATE,
    allowNull: true,
    defaultValue: sequelize.literal('NOW()')
  },
});

Platform.belongsTo(User);
User.hasMany(Platform);

module.exports = Platform;
