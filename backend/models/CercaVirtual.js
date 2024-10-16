// models/CercaVirtual.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Dispositivo = require('./Dispositivo');

const CercaVirtual = sequelize.define('CercaVirtual', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    raio: {
        type: DataTypes.FLOAT, // Raio da cerca virtual em metros ou quilômetros
        allowNull: false,
    },
    lat: {
        type: DataTypes.FLOAT, // Latitude do centro da cerca
        allowNull: false,
    },
    lng: {
        type: DataTypes.FLOAT, // Longitude do centro da cerca
        allowNull: false,
    },
});

CercaVirtual.belongsTo(Dispositivo, { foreignKey: 'dispositivoId', onDelete: 'CASCADE' }); // Associa a cerca a um dispositivo

module.exports = CercaVirtual;
