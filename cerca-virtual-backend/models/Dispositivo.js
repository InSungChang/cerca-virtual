const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dispositivo = sequelize.define('Dispositivo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imei: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('ativo', 'inativo'),
        defaultValue: 'ativo',
    },
    localizacao_atual: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = Dispositivo;
