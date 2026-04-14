const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bedNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ivType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    flowRate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    totalVolume: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    volumeInfused: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    temperature: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    distance: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    dropCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('Normal', 'Warning', 'Critical', 'Completed'),
        defaultValue: 'Normal',
    },
    photo: {
        type: DataTypes.STRING, // path to uploaded file
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admissionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = Patient;
