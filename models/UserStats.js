const { DataTypes, Model } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

class UserStats extends Model { }

UserStats.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User,
                key: 'user_id',
            },
        },
        last_daily_claim: {
            type: DataTypes.DATE,
            defaultValue: null,
        },
        daily_streak: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        // Add other stats fields here as needed
    },
    {
        sequelize,
        modelName: 'UserStats',
    }
);

// Set up associations
User.hasOne(UserStats, { foreignKey: 'user_id' });
UserStats.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UserStats;

