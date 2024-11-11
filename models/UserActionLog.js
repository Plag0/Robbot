// models/UserActionLog.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const UserActionLog = sequelize.define('UserActionLog', {
    action_id: {
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
    action_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action_details: {
        type: DataTypes.TEXT,
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

// Associations
User.hasMany(UserActionLog, { foreignKey: 'user_id' });
UserActionLog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UserActionLog;
