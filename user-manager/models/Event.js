// Event.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../services/postgresql');
const User = require('./User');

const Event = sequelize.define('Event', {
  value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING
  },
  dateStart: {
    type: DataTypes.DATE,
    allowNull: false
  },
  dateEnd: {
    type: DataTypes.DATE,
    allowNull: false
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

Event.belongsTo(User);
User.hasMany(Event);

module.exports = Event;
