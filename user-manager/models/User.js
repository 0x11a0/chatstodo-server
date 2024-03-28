// User.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../services/postgresql");

const User = sequelize.define("User", {
  _id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
});

module.exports = User;
