// db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite', // This will create a database.sqlite file in your base directory
    logging: false, // Disable logging; set to console.log to see the raw SQL queries
});

module.exports = sequelize;
