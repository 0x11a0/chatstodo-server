// Platform.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/db");
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
});

Platform.belongsTo(User);
User.hasMany(Platform);

module.exports = Platform;
