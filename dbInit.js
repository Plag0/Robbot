// dbInit.js
const sequelize = require('./db');
const User = require('./models/User');
const Asset = require('./models/Asset');
const Position = require('./models/Position');
const Order = require('./models/Order');
const Alert = require('./models/Alert');
const MarketTransaction = require('./models/MarketTransaction');
const UserActionLog = require('./models/UserActionLog');
const UserStats = require('./models/UserStats');

async function initDatabase() {
    try {
        // Sync all models that aren't already in the database
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');

        // Optionally, seed initial data
        // await seedInitialData();
    } catch (error) {
        console.error('Unable to sync the database:', error);
    }
}

initDatabase();
