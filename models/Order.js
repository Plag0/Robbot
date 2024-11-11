// models/Order.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Asset = require('./Asset');

const Order = sequelize.define('Order', {
  order_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Asset,
      key: 'asset_id',
    },
  },
  order_type: {
    type: DataTypes.ENUM('market', 'limit', 'stop'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true, // Only required for limit and stop orders
  },
  status: {
    type: DataTypes.ENUM('pending', 'executed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  executed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = Order;
