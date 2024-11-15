// models/Position.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Asset = require('./Asset');

const Position = sequelize.define('Position', {
  position_id: {
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
    onDelete: 'CASCADE', // If a user is deleted, their positions are deleted
    onUpdate: 'CASCADE',
  },
  asset_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Asset,
      key: 'asset_id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  position_type: {
    type: DataTypes.ENUM('long', 'short'),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  price_per_share: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  status: {
    type: DataTypes.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open',
  },
  opened_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  closed_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  stop_loss: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    validate: {
      min: 0,
    },
  },
  take_profit: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: true,
    validate: {
      min: 0,
    },
  },
}, {
  indexes: [
    {
      fields: ['user_id', 'asset_id'],
    },
  ],
});

module.exports = Position;
