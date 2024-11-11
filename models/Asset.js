// models/Asset.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Asset = sequelize.define('Asset', {
  asset_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  symbol: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  asset_type: {
    type: DataTypes.ENUM('stock', 'etf', 'crypto', 'commodity', 'forex'),
    allowNull: false,
  },
});

module.exports = Asset;
