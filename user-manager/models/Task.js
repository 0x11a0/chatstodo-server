// Task.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/postgresql');
const User = require('./User');

const Task = sequelize.define('Task', {
  value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

Task.belongsTo(User);
User.hasMany(Task);

module.exports = Task;
