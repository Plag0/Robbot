// models/Alert.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Asset = require('./Asset');

const Alert = sequelize.define('Alert', {
  alert_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  asset_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Asset,
      key: 'asset_id',
    },
  },
  alert_type: {
    type: DataTypes.ENUM('price', 'position'),
    allowNull: false,
  },
  target_price: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'triggered', 'cancelled'),
    allowNull: false,
    defaultValue: 'active',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  triggered_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Alert;
