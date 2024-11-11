// models/MarketTransaction.js

const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Asset = require('./Asset');
const Position = require('./Position');

const MarketTransaction = sequelize.define('MarketTransaction', {
  transaction_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  position_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Position,
      key: 'position_id',
    },
    onDelete: 'SET NULL', // If a position is deleted, keep the transaction record
    onUpdate: 'CASCADE',
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
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
  quantity: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    validate: {
      notZero(value) {
        if (parseFloat(value) === 0) {
          throw new Error('Quantity cannot be zero.');
        }
      },
    },
  },
  price_per_share: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  transaction_type: {
    type: DataTypes.ENUM('open', 'close', 'partial_close'),
    allowNull: false,
  },
  position_type: {
    type: DataTypes.ENUM('long', 'short'),
    allowNull: false,
  },
  fee: {
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
    defaultValue: 0,
  },  
  transaction_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  indexes: [
    {
      fields: ['user_id', 'asset_id'],
    },
  ],
});

module.exports = MarketTransaction;
