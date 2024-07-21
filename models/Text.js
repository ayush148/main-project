const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Text = sequelize.define('Text', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Text;