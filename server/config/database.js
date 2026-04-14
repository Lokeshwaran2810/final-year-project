require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.DATABASE_URL) {
    // Production: PostgreSQL on Render
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Needed for Render's managed PostgreSQL
            },
        },
        logging: false,
    });
} else {
    // Local development: SQLite
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, 'database.sqlite'),
        logging: false,
    });
}

module.exports = sequelize;

