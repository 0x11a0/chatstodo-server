// Summary.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/postgresql');
const User = require('./User');

const Summary = sequelize.define('Summary', {
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

Summary.belongsTo(User);
User.hasMany(Summary);

module.exports = Summary;
